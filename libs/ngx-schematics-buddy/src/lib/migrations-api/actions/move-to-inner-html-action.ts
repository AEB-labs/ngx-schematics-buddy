import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addInnerHtml } from '../helper-functions/add-inner-html';
import { getLiteralAttributeStringValue } from '../helper-functions/change-attribute-value';
import { findAttribute } from '../helper-functions/find-attribute';
import { removeAttribute } from '../helper-functions/remove-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Removes an attribute and adds its value as innerHTML, optionally wrapped by another tag.
 * If the attribute has square brackets, double braces ( {{...}} ) will also be added.
 */
export class MoveToInnerHtmlAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      attributeName: string;
      wrapWithTag?: string;
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
    const attribute = findAttribute({
      element: element,
      name: this.params.attributeName,
    });
    if (!attribute) {
      return;
    }
    if (attribute.value) {
      // if possible, write the contents as simple text node. Otherwise, wrap it in {{...}}
      const literalStringValue = getLiteralAttributeStringValue({
        value: attribute.value,
        hasSquareBrackets: attribute.name.startsWith('['),
      });
      const innerHtmlContent =
        literalStringValue === undefined
          ? `{{${attribute.value}${attribute.value.endsWith('}') ? ' ' : ''}}}`
          : literalStringValue;
      addInnerHtml({
        recorder,
        element,
        content: this.params.wrapWithTag
          ? `\n<${this.params.wrapWithTag}>${innerHtmlContent}</${this.params.wrapWithTag}>`
          : innerHtmlContent,
        location: 'start',
      });
    }
    removeAttribute({
      element,
      recorder,
      attributeName: attribute.name,
    });
  }
}
