import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, extname } from 'path';

import type { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';

const branch =
  process.env.GITHUB_REF_NAME ??
  process.env.BRANCH ??
  execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const baselineUrl = process.env.GITHUB_ACTIONS
  ? 'http://localhost:8050/'
  : 'https://lyne-visual-regression-baseline.app.sbb.ch/';

export const visualRegressionConfig = {
  baseDir: 'dist/screenshots',
  async getBaseline({ filePath, name }) {
    const baselineFileUrl = baselineUrl + name + extname(filePath);
    const infoFilePath = filePath + '.json';
    const info = existsSync(infoFilePath) ? JSON.parse(readFileSync(infoFilePath, 'utf8')) : {};
    if (existsSync(filePath) && info.branch === branch) {
      return readFileSync(filePath);
    } else if (existsSync(filePath) && info.etag) {
      const response = await fetch(baselineFileUrl, {
        method: 'HEAD',
        headers: { 'if-none-match': info.etag },
      });

      if (response.status === 304) {
        return readFileSync(filePath);
      } else if (response.status === 404) {
        return undefined;
      }
    }

    // If the image address is not reachable, fetch throws, so we wrap it in try/catch.
    try {
      const response = await fetch(baselineFileUrl);
      if (response.ok) {
        const etag = response.headers.get('etag');
        const buffer = Buffer.from(await response.arrayBuffer());
        mkdirSync(dirname(filePath), { recursive: true });
        writeFileSync(filePath, buffer);
        writeFileSync(infoFilePath, JSON.stringify({ etag }, null, 2), 'utf8');

        return buffer;
      }
    } catch (e) {
      return undefined;
    }
  },
  saveBaseline({ filePath, content }) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
    writeFileSync(
      filePath + '.json',
      JSON.stringify({ branch, etag: createHash('sha256').update(content).digest('hex') }),
      'utf8',
    );
  },
} satisfies Parameters<typeof visualRegressionPlugin>[0];
