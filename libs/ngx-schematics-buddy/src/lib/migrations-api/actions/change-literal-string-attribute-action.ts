import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { changeLiteralStringAttribute } from '../helper-functions/change-literal-string-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 *  Changes the literal string value of an attribute with a given name
 *
 *  Existing attributes will be searched case-insensitively. Attributes with square brackets will
 *  only be changed if they only contain a string literal that does not use escape sequences.
 *
 *  Does nothing if the element does not have an attribute with that name, or if it cannot be
 *  interpreted safely as a literal string value.
 */
export class ChangeLiteralStringAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      readonly name: string;
      readonly changeValue: (oldValue: string) => string;
      readonly conditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    return changeLiteralStringAttribute({
      recorder,
      element,
      name: this.params.name,
      changeValue: this.params.changeValue,
    });
  }
}
