import { normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { AngularWorkspace } from '@angular/cli/src/utilities/config';

export type Asset = string | GlobAssetWithoutInput;

// The input path may need to be determined from the project (if not from node modules)
export interface GlobAssetWithoutInput {
  glob: string;
  input?: string;
  output: string;
}

export function addStyleToAngularJson(tree: Tree, style: string) {
  return mutateAngularJsonStyleObject(tree, style, addStyle);
}

export function removeStyleFromAngularJson(tree: Tree, style: string) {
  return mutateAngularJsonStyleObject(tree, style, removeStyle);
}

function mutateAngularJsonStyleObject(
  tree: Tree,
  style: string,
  // eslint-disable-next-line
  styleOperation: (json: any, style: string) => void
): Tree {
  // eslint-disable-next-line
  let json: any;
  try {
    json = getAngularJson(tree);
  } catch (e) {
    return tree;
  }

  // apply the mutation to all projects of type "application"
  const projects = json.projects;
  const applicationNames = getProjectNamesOfType(projects, 'application');
  for (const applicationName of applicationNames) {
    const project = projects[applicationName];
    initStylesIfNotPresent(project);
    styleOperation(project, style);
  }
  tree.overwrite('angular.json', JSON.stringify(json, null, 2));

  return tree;
}

export function getProjectNamesOfType(
  // eslint-disable-next-line
  projects: any,
  projectType: 'application' | 'library'
): string[] {
  return (
    Object.entries(projects)
      // eslint-disable-next-line
      .filter((project: any) => project[1].projectType === projectType)
      // eslint-disable-next-line
      .map((project: any) => project[0])
  );
}

// eslint-disable-next-line
function addStyle(project: any, style: string) {
  const styles = project.architect.build.options.styles;
  if (!styles.includes(style)) {
    project.architect.build.options.styles.push(style);
  }
}

// eslint-disable-next-line
function removeStyle(project: any, style: string) {
  const styles = project.architect.build.options.styles;
  if (styles.includes(style)) {
    const index = project.architect.build.options.styles.findIndex(
      (s: string) => s === style
    );
    project.architect.build.options.styles.splice(index, 1);
  }
}

// eslint-disable-next-line
function initStylesIfNotPresent(project: any) {
  if (!project.architect.build.options.styles) {
    project.architect.build.options.styles = [];
  }
}

// eslint-disable-next-line
function initAssetsIfNotPresent(project: any) {
  if (!project.architect.build.options.styles) {
    project.architect.build.options.assets = [];
  }
}

/**
 * Angular 11 removed the type 'WorkspaceSchema' from their public API
 * @return WorkspaceSchema (see angular.json for correct object paths)
 */
// eslint-disable-next-line
export function getAngularJson(tree: Tree): any {
  if (!tree.exists('angular.json')) {
    throw new SchematicsException();
  }

  const treeAsObject = tree.read('angular.json');
  if (!treeAsObject) {
    throw new SchematicsException();
  }

  const sourceText = treeAsObject.toString('utf-8');
  return JSON.parse(sourceText) as AngularWorkspace;
}

export function addStylesToAngularJson(styles: string[]): Rule {
  return (tree: Tree, context: SchematicContext) => {
    styles.forEach((style) => {
      addStyleToAngularJson(tree, style);
      context.logger.log('info', `✅️ Added "${style}" to angular.json`);
    });

    return tree;
  };
}

export function removeStylesFromAngularJson(styles: string[]): Rule {
  return (tree: Tree, context: SchematicContext) => {
    styles.forEach((style) => {
      removeStyleFromAngularJson(tree, style);
      context.logger.log('info', `✅️ Removed "${style}" from angular.json`);
    });

    return tree;
  };
}

function addAssetToProject(
  // eslint-disable-next-line
  project: any,
  newAsset: Asset,
  assetsPathBase: string,
  context: SchematicContext
): void {
  const projectAssets = project.architect.build.options.assets;
  // eslint-disable-next-line
  if (
    typeof newAsset === 'string' &&
    !projectAssets.some((asset: any) => asset === newAsset)
  ) {
    projectAssets.push(newAsset);
  } else {
    const newAssetGlob = newAsset as GlobAssetWithoutInput;
    // eslint-disable-next-line
    const hasExistingGlob = projectAssets.some((asset: any) => {
      return (
        typeof asset !== 'string' &&
        asset.glob === newAssetGlob.glob &&
        asset.output === newAssetGlob.output
      );
    });
    if (!hasExistingGlob) {
      const assetToAdd = {
        ...newAssetGlob,
        input: normalize(`${assetsPathBase}/i18n`),
      };
      projectAssets.push(assetToAdd);
      context.logger.log(
        'info',
        `✅️ Added "${JSON.stringify(assetToAdd)} to angular.json"`
      );
    }
  }
}

function addAssetToAngularJson(
  tree: Tree,
  asset: Asset,
  context: SchematicContext
): Tree {
  // eslint-disable-next-line
  let json: any;
  try {
    json = getAngularJson(tree);
  } catch (e) {
    return tree;
  }
  // apply the mutation to all projects of type "application"
  const projects = json.projects;
  const applicationNames = getProjectNamesOfType(projects, 'application');
  for (const applicationName of applicationNames) {
    const project = projects[applicationName];
    initAssetsIfNotPresent(project);
    const assetsPathBase = normalize(`${project.sourceRoot}/assets`);
    addAssetToProject(project, asset, assetsPathBase, context);
  }
  tree.overwrite('angular.json', JSON.stringify(json, null, 2));
  return tree;
}

export function addAssetsToAngularJson(assets: Asset[]): Rule {
  return (tree: Tree, context: SchematicContext) => {
    for (const asset of assets) {
      addAssetToAngularJson(tree, asset, context);
    }
    return tree;
  };
}
