import type { Stats } from 'fs';
import { existsSync, mkdirSync, promises, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const config = {
  boilerplateComponentName: 'component',
  boilerplateDirectory: 'tools/generate-component/boilerplate',
  boilerplateIndexDirectory: 'tools/generate-component/index',
  sourceDirectory: 'src/elements',
};

function convertKebabCaseToPascalCase(componentName: string): string {
  const capitalize = (_string: string): string =>
    _string.charAt(0).toUpperCase() + _string.slice(1);

  const words = componentName.split('-');
  const capitalized = words.map((word) => capitalize(word));

  return capitalized.join('');
}

async function getBoilerplateFiles(
  _sourceFiles?: string,
  _foundFiles?: string[],
): Promise<string[]> {
  try {
    const sourceFiles: string[] = await promises.readdir(
      _sourceFiles || config.boilerplateDirectory,
    );
    const foundFiles: string[] = _foundFiles || [];

    for await (const file of sourceFiles) {
      const fromPath: string = join(_sourceFiles || config.boilerplateDirectory, file);
      const stat: Stats = await promises.stat(fromPath);

      if (stat.isFile()) {
        foundFiles.push(fromPath);
      } else if (stat.isDirectory()) {
        await getBoilerplateFiles(fromPath, foundFiles);
      }
    }

    return foundFiles;
  } catch (e) {
    // Catch anything bad that happens
    console.error('There was an error iterating over the boilerplate files... ', e);
    return [];
  }
}

function createDirectories(targetDirectory: string): void {
  mkdirSync(targetDirectory);
}

function copyFiles(
  foundFiles: string[],
  componentName: string,
  targetDirectory: string,
  sourceDirectory: string,
): void {
  const componentFileName: string = componentName.replace('sbb-', '');
  foundFiles.forEach((file) => {
    try {
      const fileData: string = readFileSync(file, 'utf8');

      const fileDataWithCorrectName: string = fileData
        .replace(/__name__/gu, componentName)
        .replace(/__noPrefixName__/gu, componentFileName)
        .replace(/__nameUpperCase__/gu, `${convertKebabCaseToPascalCase(componentName)}Element`);

      try {
        const relativePath: string = relative(sourceDirectory, file);
        const fileName: string = relativePath.replace(
          `${config.boilerplateComponentName}.`,
          `${componentFileName}.`,
        );
        const targetPath: string = `${targetDirectory}/${fileName}`;

        writeFileSync(targetPath, fileDataWithCorrectName);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.log(`error processing boilerplate file ${file}: ${err}`);
    }
  });
}

async function createComponent(componentName: string): Promise<void> {
  if (!componentName) {
    console.log(`
      Please pass a component name like so: yarn generate my-component-name
    `);
    return;
  }

  // make sure we have a dash in the name and the "sbb" prefix
  if (componentName.indexOf('sbb-') !== 0) {
    console.log(
      'component name must be in kebab case and must start with "sbb" prefix, eg: sbb-my-component-name',
    );
    return;
  }

  const directoryName: string = componentName.replace('sbb-', '');
  const targetDirectory: string = `${config.sourceDirectory}/${directoryName}`;

  // check if a component with the passed name does not already exist
  if (existsSync(targetDirectory)) {
    console.log(`A component with the name ${componentName} already exists`);
    return;
  }

  const foundFiles: string[] = await getBoilerplateFiles();
  if (foundFiles.length < 1) {
    console.log('Could not find boilerplate files');
    return;
  }

  createDirectories(targetDirectory);
  copyFiles(foundFiles, componentName, targetDirectory, config.boilerplateDirectory);
  copyFiles(
    await getBoilerplateFiles(config.boilerplateIndexDirectory),
    componentName,
    config.sourceDirectory,
    config.boilerplateIndexDirectory,
  );
}

await createComponent(process.argv[2]);
