import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addCommentBeforeNode } from '../helper-functions/add-comment-before-node';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Adds an HTML comment of form [Migration to v6]: {commentText} before the nodes
 * which satisfy the given conditions.
 */
export class AddMigrationCommentAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      migrationCommentVersion: number;
      migrationCommentText: string;
      conditions: ReadonlyArray<TemplateActionCondition>;
      allowedPaths?: ReadonlyArray<string | RegExp>;
    }
  ) {
    super(params.conditions, params.allowedPaths);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    const { migrationCommentVersion: v, migrationCommentText: t } = this.params;
    const commentText = `[Migration to v${v}]: ${t}`;
    addCommentBeforeNode({
      recorder,
      element,
      commentText,
    });
  }
}
