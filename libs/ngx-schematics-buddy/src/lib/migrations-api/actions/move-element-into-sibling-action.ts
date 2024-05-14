import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addInnerHtml } from '../helper-functions/add-inner-html';
import { findElements } from '../helper-functions/find-elements';
import { getRawElement } from '../helper-functions/get-raw-element';
import { removeElement } from '../helper-functions/remove-element';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Moves an element to the first matching sibling
 */
export class MoveElementIntoSiblingAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      conditions: ReadonlyArray<TemplateActionCondition>;
      siblingConditions: ReadonlyArray<TemplateActionCondition>;
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
    const parent = parents.get(element);
    if (!parent || parent.children.length === 0) {
      return;
    }
    const sibling = findElements(
      parent.children,
      parents,
      this.params.siblingConditions,
      true
    );
    if (!sibling.length) {
      return;
    }
    addInnerHtml({
      recorder,
      element: sibling[0],
      location: 'start',
      content: getRawElement(element, fileContent),
    });
    removeElement({ recorder, element });
  }
}
