import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element, Text } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { AttributeValue } from '../helper-functions/change-attribute-value';
import { findAttribute } from '../helper-functions/find-attribute';
import { removeInnerHtml } from '../helper-functions/remove-inner-html';
import { setAttributeValue } from '../helper-functions/set-attribute-value';
import {
  hasChildElement,
  hasContent,
  TemplateActionCondition,
} from '../template-action-condition';

/**
 * Moves innerHTML as string to an attribute. Won't work vor html elements.
 */
export class MoveInnerHtmlToAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      attributeName: string;
      propertyBinding?: boolean;
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
    if (findAttribute({ element, name: this.params.attributeName })) {
      // don't override existing attribute
      return;
    }

    if (!hasContent()(element)) {
      // don't migrate empty (or whitespace-only) contents
      return;
    }

    if (hasChildElement()(element)) {
      // can't migrate elements into an attribute
      return;
    }

    const textContent = element.children
      .map((child) => (child instanceof Text ? child.value : ''))
      .join('')
      .trim();

    // see if the html is just one interpolation - then we can use the binding syntax
    let value: AttributeValue;
    if (
      textContent.startsWith('{{') &&
      textContent.endsWith('}}') &&
      textContent.indexOf('}}') === textContent.length - 2
    ) {
      value = {
        hasSquareBrackets: true,
        value: textContent.substring(2, textContent.length - 2).trim(),
      };
    } else {
      value = {
        hasSquareBrackets: false,
        value: textContent,
      };
    }

    setAttributeValue({
      recorder,
      fileContent,
      element,
      name: this.params.attributeName,
      value,
    });
    removeInnerHtml({
      element,
      recorder,
    });
  }
}
