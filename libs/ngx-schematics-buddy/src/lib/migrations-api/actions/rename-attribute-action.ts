import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { renameAttributes } from '../helper-functions/rename-attributes';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Renames all matching attributes on all elements that fulfill the provided conditions.
 * This will also rename attributes that have square brackets.
 * Square brackets will be kept as is if they exist.
 *
 * The attribute name can be either matched by a static string or by a function.
 * The new name can either be given as a static string or by a function, which receives the old attribute name.
 */
export class RenameAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      oldName: string | ((attributeName: string) => boolean);
      newName: string | ((oldName: string) => string);
      conditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    renameAttributes({
      element,
      recorder,
      oldName: this.params.oldName,
      newName: this.params.newName,
    });
  }
}
