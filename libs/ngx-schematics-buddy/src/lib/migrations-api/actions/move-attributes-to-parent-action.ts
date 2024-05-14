import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addAttribute } from '../helper-functions/add-attribute';
import { findAttribute } from '../helper-functions/find-attribute';
import { findChild } from '../helper-functions/find-child';
import { removeAttribute } from '../helper-functions/remove-attribute';
import { TemplateActionCondition } from '../template-action-condition';
import { withoutSquareBrackets, withSquareBrackets } from '../utils';

/**
 * Finds all parent elements matching the provided parentConditions.
 * For the first child element matching the provided childConditions, this moves the specified attributes to the parent element.
 */
export class MoveAttributesToParentAction extends AbstractTemplateAction {
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
      const attribute = findAttribute({ element: child, name: attributeName });
      if (!attribute) {
        continue;
      }
      removeAttribute({ element: child, recorder, attributeName });
      addAttribute({
        element,
        recorder,
        attributeName: attribute.name.startsWith('[')
          ? withSquareBrackets(attributeName)
          : withoutSquareBrackets(attributeName),
        value: attribute.value,
        fileContent,
      });
    }
  }
}
