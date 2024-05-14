import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { copyAttribute } from '../helper-functions/copy-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Copies an attribute on all elements that fulfill the provided conditions.
 * This will also copy attributes that have square brackets.
 * Square brackets will be kept as is if they exist.
 */
export class CopyAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      oldName: string;
      newName: string;
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
    copyAttribute({
      element,
      recorder,
      oldName: this.params.oldName,
      newName: this.params.newName,
    });
  }
}
