// This script checks which OS the visual regression testing is run on
// and if it is not Linux, runs it in a container.

import { execSync, type ExecSyncOptionsWithStringEncoding } from 'child_process';
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { platform } from 'os';

import { startTestRunner } from '@web/test-runner';
import * as glob from 'glob';

if (process.env.GITHUB_ACTIONS) {
  // When being run on GitHub Actions we have two use cases.
  // Baseline generation for which our expectation is to not fail.
  // Diff generation if any test fails, for which we copy only the necessary
  // files to dist/screenshots-artifact/ to reduce artifact size.
  const runner = await startTestRunner({ autoExitProcess: false });
  if (!runner) {
    throw new Error(
      `Unexpected state. Test runner not available. Check tools/visual-regression-testing/exec.ts execution.`,
    );
  }
  await new Promise<boolean>((r) => runner.on('stopped', r));

  const screenshotDir = new URL('../../dist/screenshots/', import.meta.url);
  const artifactDir = new URL('../../dist/screenshots-artifact/', import.meta.url);
  mkdirSync(artifactDir, { recursive: true });
  writeFileSync(new URL('./.keep', artifactDir), '', 'utf8');

  if (runner.passed) {
    // Tests passed. Do nothing.
    process.exit(0);
  }

  // When visual regression tests have failed, we only want to pack the relevant screenshots
  // into the artifact transfered to the secure workflow, as uploading and downloading the full
  // baseline would take far longer.
  // Due to this we copy the necessary screenshots to /dist/screenshots-artifact which will
  // be moved to /dist/screenshots in the secure workflow.
  const failedDirs = glob.sync('*/failed/', { cwd: screenshotDir });
  for (const failedDir of failedDirs) {
    cpSync(new URL(`./${failedDir}`, screenshotDir), new URL(`./${failedDir}`, artifactDir), {
      force: true,
      recursive: true,
    });
  }

  const failedFiles = glob
    .sync('*/failed/**/*.png', { cwd: artifactDir, ignore: '**/*-diff.png' })
    .map((p) => p.replace('/failed/', '/baseline/'));
  for (const failedFile of failedFiles) {
    const baselineFile = new URL(`./${failedFile}`, screenshotDir);
    if (existsSync(baselineFile)) {
      cpSync(baselineFile, new URL(`./${failedFile}`, artifactDir), {
        force: true,
        recursive: true,
      });
    }
  }
} else if ((platform() === 'linux' && !process.env.DEBUG) || process.env.FORCE_LOCAL) {
  await startTestRunner();
} else {
  function executableIsAvailable(name: string): string | null {
    try {
      execSync(`${platform().startsWith('win') ? 'where' : 'which'} ${name}`, { encoding: 'utf8' });
      return name;
    } catch (error) {
      return null;
    }
  }

  const containerCmd = executableIsAvailable('podman') ?? executableIsAvailable('docker');
  if (!containerCmd) {
    console.log('Either docker or podman need to be installed!');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const cwd = new URL('../../', import.meta.url);
  const tag = 'lyne-vrt';
  const execOptions: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf8',
    stdio: 'inherit',
    cwd,
  };
  const branch =
    process.env.GITHUB_REF_NAME ??
    process.env.BRANCH ??
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  execSync(
    `${containerCmd} build ` +
      '--file=tools/visual-regression-testing/testing.Dockerfile ' +
      `--tag=${tag} .`,
    execOptions,
  );
  console.log(`\nTest image ready\n`);
  mkdirSync(new URL('./dist/screenshots', cwd), { recursive: true });
  execSync(
    `${containerCmd} run  -it --rm --ipc=host ` +
      `--env=BRANCH="${branch}"` +
      `--volume=./dist/screenshots:/dist/screenshots ` +
      `--entrypoint='["yarn", "wtr"${args.map((a) => `, "${a}"`).join('')}]' ` +
      tag,
    execOptions,
  );
}
