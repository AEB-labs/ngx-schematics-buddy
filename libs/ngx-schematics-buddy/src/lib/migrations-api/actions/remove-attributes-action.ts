import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { removeAttribute } from '../helper-functions/remove-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Removes an attribute on all elements that fulfill the provided conditions.
 * This will also remove attributes that have square brackets.
 */
export class RemoveAttributesAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      attributeNames: ReadonlyArray<string>;
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
    for (const attributeName of this.params.attributeNames) {
      removeAttribute({
        recorder,
        element,
        attributeName,
      });
    }
  }
}
