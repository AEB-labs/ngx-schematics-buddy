import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import {
  AttributeValue,
  changeAttributeValue,
} from '../helper-functions/change-attribute-value';
import { TemplateActionCondition } from '../template-action-condition';

/**
 Changes the value of an attribute with a given name

 Existing attributes will be searched case-insensitively. Attributes with square brackets will
 also be found. In this case, the callback will receive true for hasSquareBrackets. The return
 value of the callback may have a different value for hasSquareBrackets, in which case the square
 brackets will be added or removed, respectively.

 Does nothing if the element does not have an attribute with that name.
 */
export class ChangeAttributeValueAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      readonly name: string;
      readonly changeValue: (oldValue: AttributeValue) => AttributeValue;
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
    changeAttributeValue({
      element,
      recorder,
      name: this.params.name,
      changeValue: this.params.changeValue,
    });
  }
}
