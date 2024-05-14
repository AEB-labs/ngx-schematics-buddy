import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { removeElementTag } from '../helper-functions/remove-element-tag';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Removes the tag of matching elements from the template while keeping the descendants intact
 */
export class RemoveElementTagAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
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
    removeElementTag({
      recorder,
      element,
    });
  }
}
