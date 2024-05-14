import { normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getAngularJson, getProjectNamesOfType } from './angular-json';

export function createI18nAssetsFilesIfNotExists(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // eslint-disable-next-line
    let json: any;
    try {
      json = getAngularJson(tree);
    } catch (e) {
      return tree;
    }
    const projects = json.projects;
    const applications = getProjectNamesOfType(projects, 'application');
    for (const application of applications) {
      const project = projects[application];
      const i18nPath = normalize(`${project.sourceRoot}/assets/i18n`);
      const dePath = `${i18nPath}/de.json`;
      const enPath = `${i18nPath}/en.json`;
      if (!tree.exists(dePath)) {
        tree.create(dePath, '{}');
        context.logger.info(
          `✅️ Added translation file "de.json" at path ${i18nPath}`
        );
      }
      if (!tree.exists(enPath)) {
        tree.create(enPath, '{}');
        context.logger.info(
          `✅️ Added translation file "en.json" at path ${i18nPath}`
        );
      }
    }
    return tree;
  };
}
