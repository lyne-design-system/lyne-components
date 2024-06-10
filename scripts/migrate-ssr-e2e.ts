/* eslint-disable import-x/default, import-x/no-named-as-default-member */
import { readFileSync, writeFileSync } from 'fs';
import { basename, dirname, relative } from 'path';

import * as glob from 'glob';
import ts from 'typescript';

/*
 * Convert e2e test files to use the lit fixture, to enable ssr testing.
 */

function* iterate(node: ts.Node): Generator<ts.Node, void, unknown> {
  yield node;
  const childNodes: ts.Node[] = [];
  ts.forEachChild(node, (n) => {
    childNodes.push(n);
  });
  for (const childNode of childNodes) {
    yield* iterate(childNode);
  }
}

const privateTesting = new URL(
  '../src/elements/core/testing/private.ts',
  import.meta.url,
).pathname.replace(/.ts$/, '.js');
const specFiles = glob
  .sync('**/*.{e2e,spec}.ts', {
    cwd: new URL('../src/', import.meta.url),
    absolute: true,
  })
  .filter((f) => !f.includes('/core/') && !f.includes('/storybook/'))
  .filter((v, _i, a) => v.endsWith('.e2e.ts') || !a.includes(v.replace(/.spec.ts/, '.e2e.ts')))
  .sort();
for (const file of specFiles) {
  const content = readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.ES2021, true);

  const fixtureUsages: ts.CallExpression[] = [];
  for (const node of iterate(sourceFile)) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.getText() === 'fixture'
    ) {
      fixtureUsages.push(node);
    }
  }

  const directoryName = basename(dirname(file));
  const className = `Sbb${directoryName.replace(/(^\w|-\w)/g, (t) => t.replace(/-/, '').toUpperCase())}Element`;
  if (!fixtureUsages.length) {
    console.log(`${file} does not have a fixture!`);
    continue;
  }

  const fixture = fixtureUsages[0];
  const fixtureText = fixture.getText().replaceAll(`.ts'`, `.js'`);
  const templateImports = new Map<string, string[]>()
    .set('@open-wc/testing', ['assert'])
    .set(
      file.includes('/elements/')
        ? relative(dirname(file), privateTesting)
        : '@sbb-esta/lyne-elements/core/testing/private.js',
      ['fixture'],
    )
    .set(`./${directoryName}.js`, [className]);
  if (fixtureText.includes('html`')) {
    templateImports.set('lit', ['html']);
  }

  const template = `${Array.from(templateImports)
    .map((i) => `import { ${i[1].join(', ')} } from '${i[0]}';`)
    .join('\n')}

describe(\`sbb-${directoryName} \${fixture.name}\`, () => {
  let root: ${className};

  beforeEach(async () => {
    root = await ${fixtureText};
  });

  it('renders', () => {
    assert.instanceOf(root, ${className});
  });
});
`;

  writeFileSync(file.replace(/.(e2e|spec).ts/, '.ssr.spec.ts'), template, 'utf8');
}

console.log('Done');
