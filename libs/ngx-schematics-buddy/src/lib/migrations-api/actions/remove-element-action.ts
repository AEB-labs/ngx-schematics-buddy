import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { removeElement } from '../helper-functions/remove-element';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Removes all elements that match the provided conditions.
 */
export class RemoveElementAction extends AbstractTemplateAction {
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
    removeElement({
      recorder,
      element,
    });
  }
}
