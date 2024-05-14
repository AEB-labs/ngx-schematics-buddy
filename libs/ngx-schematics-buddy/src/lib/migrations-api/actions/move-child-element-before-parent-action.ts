import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addBeforeElement } from '../helper-functions/add-before-element';
import { getRawElement } from '../helper-functions/get-raw-element';
import { removeElement } from '../helper-functions/remove-element';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Removes an element and re-adds it before the start tag of its parent.
 */
export class MoveChildElementBeforeParentAction extends AbstractTemplateAction {
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

      addBeforeElement({
        recorder,
        element: parentElement,
        content: rawContent,
      });
    }
  }
}
