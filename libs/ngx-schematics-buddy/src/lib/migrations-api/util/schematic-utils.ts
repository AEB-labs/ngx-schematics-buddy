import { normalize } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { getActiveProject, getClasses } from 'ng-morph';
import { getInlineTemplate } from './ts/get-inline-template';

// eslint-disable-next-line
export function fillOptionsWithPaths(_options: any) {
  return (tree: Tree) => {
    _options.rootPaths = findProjectPaths(tree);
    _options.templatePaths = findTemplates(tree, _options.rootPaths);
    _options.typescriptFilePaths = findTypescriptFiles(
      tree,
      _options.rootPaths
    );
    return tree;
  };
}

function isRunInTestEnvironment(): boolean {
  return process.env['NODE_ENV'] === 'test';
}

export function findProjectPaths(tree: Tree): string[] {
  const workspaceConfigBuffer = tree.read('angular.json');
  if (!workspaceConfigBuffer) {
    // only log this one when not being run in a jest test because otherwise the test output is polluted
    if (!isRunInTestEnvironment()) {
      console.warn(
        'No angular.json found. Taking current working directory as root path'
      );
    }
    return [''];
  }

  const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
  const projectKeys = Object.keys(workspaceConfig.projects);
  return projectKeys.map((key) => {
    const project = workspaceConfig.projects[key];
    const sourceRoot = project.sourceRoot ?? 'src';
    const path = `/${sourceRoot}`;
    return normalize(path);
  });
}

export function findIndexPaths(tree: Tree): string[] {
  const workspaceConfigBuffer = tree.read('angular.json');
  if (!workspaceConfigBuffer) {
    // only log this one when not being run in a jest test because otherwise the test output is polluted
    if (!isRunInTestEnvironment()) {
      console.warn(
        'No angular.json found. Taking current working directory as root path'
      );
    }
    return [''];
  }

  const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
  const projectKeys = Object.keys(workspaceConfig.projects);
  return projectKeys
    .map((key) => {
      const project = workspaceConfig.projects[key];
      let indexPath = project.architect?.build?.options?.index;

      if (!indexPath) {
        const sourceRoot = project.sourceRoot ?? 'src';
        const path = `/${sourceRoot}/index.html`;
        indexPath = normalize(path);
      }

      return indexPath;
    })
    .filter((path) => !!tree.get(path));
}

export function findFiles(
  fileType: string,
  tree: Tree,
  rootPaths: string[]
): Array<string> {
  const paths: Array<string> = [];
  rootPaths.forEach((rootPath) => {
    tree.getDir(normalize(rootPath)).visit((filePath) => {
      if (filePath.endsWith(fileType)) {
        paths.push(filePath);
      }
    });
  });
  return paths;
}

export function findTemplates(tree: Tree, rootPaths: string[]): Set<string> {
  const htmlFiles = findFiles('.html', tree, rootPaths);

  let tsFiles: Array<string> = [];
  // TODO check if this condition is still needed when older migrations are deleted
  // the check is more or less only for older migrations (<v5), but also to make sure that the migration does not
  // fail (getClasses()) will throw an error when the activeProject is not present
  if (getActiveProject()) {
    tsFiles = findFiles('.component.ts', tree, rootPaths).filter((filePath) => {
      return getClasses(filePath).some((cls) => !!getInlineTemplate(cls));
    });
  }
  return new Set([...htmlFiles, ...tsFiles]);
}

export function findTypescriptFiles(
  tree: Tree,
  rootPaths: string[]
): Set<string> {
  return new Set(findFiles('.ts', tree, rootPaths));
}
