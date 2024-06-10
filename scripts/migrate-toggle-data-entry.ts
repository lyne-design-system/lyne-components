/* eslint-disable import-x/default, import-x/no-named-as-default-member */
import { readFileSync, writeFileSync } from 'fs';

import * as glob from 'glob';
// eslint-disable-next-line @typescript-eslint/naming-convention
import MagicString from 'magic-string';
import ts from 'typescript';

function* iterate(node: ts.Node): Generator<ts.Node, void, unknown> {
  yield node;

  const children: ts.Node[] = [];
  ts.forEachChild(node, (n) => {
    children.push(n);
  });

  for (const child of children) {
    yield* iterate(child);
  }
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// custom ignores can be done like this, for example by saying
// you'll ignore all markdown files, and all folders named 'docs'
const sources = glob.sync('src/elements/**/*.ts', {
  cwd: new URL('..', import.meta.url),
  absolute: true,
  ignore: {
    ignored: (p) => /(index|e2e|stories|spec|config)\.ts$/.test(p.name),
  },
});

for (const filePath of sources) {
  const file = await readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, file, ts.ScriptTarget.ES2021, true);
  const newSource = new MagicString(file, { filename: sourceFile.fileName });

  let datasetEntryImport: ts.ImportDeclaration | null = null;
  const datesetEntryCalls: ts.CallExpression[] = [];

  for (const node of iterate(sourceFile)) {
    if (ts.isImportDeclaration(node)) {
      if (node.getText().match(/toggleDatasetEntry/)) {
        datasetEntryImport = node;
      }
    } else if (ts.isCallExpression(node) && node.getText().startsWith('toggleDatasetEntry')) {
      datesetEntryCalls.push(node);
    }
  }

  // Remove the import
  if (datasetEntryImport) {
    const imports = datasetEntryImport.importClause!.namedBindings as ts.NamedImports;

    // if it's the only import
    if (imports.elements.length === 1) {
      //remove the whole statement
      newSource.remove(datasetEntryImport.getStart(), datasetEntryImport.getEnd());
    } else {
      const toRemove = imports.elements.find((el) =>
        el.getText().startsWith('toggleDatasetEntry'),
      )!;
      const endIndex =
        file.charAt(toRemove.getEnd()) === ',' ? toRemove.getEnd() + 1 : toRemove.getEnd();
      newSource.remove(toRemove.getStart(), endIndex);
    }
  }

  // migrate the usage
  for (const call of datesetEntryCalls) {
    const element = call.arguments[0].getText();
    const attribute = call.arguments[1].getText().replace(/'/g, '');
    const condition = call.arguments[2].getText();

    const newCall = `${element}.toggleAttribute('data-${toKebabCase(attribute)}', ${condition})`;
    newSource.update(call.getStart(), call.getEnd(), newCall);
  }

  writeFileSync(filePath, newSource.toString(), 'utf8');
}
