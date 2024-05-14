import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import { findFiles, findProjectPaths } from './util/schematic-utils';
import { AbstractMigrationAction } from './abstract-migration-action';

export interface AbstractFileActionOptions {
  readonly fileExtension: string;
}

export abstract class AbstractFileAction extends AbstractMigrationAction {
  protected constructor(private readonly options: AbstractFileActionOptions) {
    super();
  }

  getRule(): Rule {
    return (tree: Tree, ctx: SchematicContext) => {
      const rootPaths = findProjectPaths(tree);
      const files = new Set(
        findFiles(this.options.fileExtension, tree, rootPaths)
      );
      for (const path of files) {
        const recorder = tree.beginUpdate(path);
        const fileContent = tree.readText(path);
        this.migrateFile(recorder, ctx, fileContent);
        tree.commitUpdate(recorder);
      }
    };
  }

  protected abstract migrateFile(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    fileContent: string
  ): void;
}
