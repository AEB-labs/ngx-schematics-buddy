import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addAttribute } from '../helper-functions/add-attribute';
import { findAttribute } from '../helper-functions/find-attribute';
import { findChild } from '../helper-functions/find-child';
import { removeAttribute } from '../helper-functions/remove-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Finds all parent elements matching the provided parentConditions.
 * For the first child element matching the provided childConditions, this moves the specified attributes from the parent to the child element.
 */
export class MoveAttributesToChildAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      childConditions: ReadonlyArray<TemplateActionCondition>;
      parentConditions: ReadonlyArray<TemplateActionCondition>;
      attributeNames: ReadonlyArray<string>;
    }
  ) {
    super(params.parentConditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void {
    const child = findChild(element, parents, this.params.childConditions);
    if (!child) {
      return;
    }

    for (const attributeName of this.params.attributeNames) {
      const attribute = findAttribute({ element, name: attributeName });
      if (!attribute) {
        continue;
      }
      removeAttribute({ element, recorder, attributeName });
      addAttribute({
        element: child,
        recorder,
        attributeName: attribute.name,
        value: attribute.value,
        fileContent,
      });
    }
  }
}
