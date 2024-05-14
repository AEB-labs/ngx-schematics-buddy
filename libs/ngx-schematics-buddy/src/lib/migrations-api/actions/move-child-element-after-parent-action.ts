import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addAfterElement } from '../helper-functions/add-after-element';
import { getRawElement } from '../helper-functions/get-raw-element';
import { removeElement } from '../helper-functions/remove-element';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Removes an element and re-adds it after the closing tag of its parent.
 */
export class MoveChildElementAfterParentAction extends AbstractTemplateAction {
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
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void {
    const parentElement = parents.get(element);
    const rawContent = getRawElement(element, fileContent);

    if (parentElement) {
      removeElement({
        recorder,
        element,
      });

      addAfterElement({
        recorder,
        element: parentElement,
        content: rawContent,
      });
    }
  }
}
