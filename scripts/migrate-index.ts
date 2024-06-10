import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { basename, dirname } from 'path';

import * as glob from 'glob';

const indexFiles = glob.sync('**/index.ts', {
  cwd: dirname(import.meta.resolve('../src/elements')),
  absolute: true,
});
for (const indexFile of indexFiles) {
  const content = readFileSync(indexFile, 'utf8').replaceAll(
    /from '.([^']+)/g,
    (_, m) => `from './${basename(dirname(indexFile))}${m.replace(/\/index.js$/, '.js')}`,
  );
  unlinkSync(indexFile);
  writeFileSync(indexFile.replace(/\/index.ts$/, '.ts'), content, 'utf8');
}
