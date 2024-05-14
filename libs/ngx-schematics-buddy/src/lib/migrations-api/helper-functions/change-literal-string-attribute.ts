import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import {
  changeAttributeValue,
  getLiteralAttributeStringValue,
} from './change-attribute-value';

/**
 *  Changes the literal string value of an attribute with a given name
 *
 *  Existing attributes will be searched case-insensitively. Attributes with square brackets will
 *  only be changed if they only contain a string literal that does not use escape sequences.
 *
 *  Does nothing if the element does not have an attribute with that name, or if it cannot be
 *  interpreted safely as a literal string value.
 */
export function changeLiteralStringAttribute(params: {
  readonly recorder: UpdateRecorder;
  readonly element: Element;
  readonly name: string;
  readonly changeValue: (oldValue: string) => string;
}) {
  changeAttributeValue({
    element: params.element,
    recorder: params.recorder,
    name: params.name,
    changeValue: (oldAttrValue) => {
      if (!oldAttrValue.hasSquareBrackets) {
        return {
          value: params.changeValue(oldAttrValue.value),
          hasSquareBrackets: false,
        };
      }
      const oldStringValue = getLiteralAttributeStringValue(oldAttrValue);
      if (oldStringValue === undefined) {
        // could not parse reliably as string
        return oldAttrValue;
      }
      const newStringValue = params.changeValue(oldStringValue);
      if (newStringValue === oldStringValue) {
        return oldAttrValue;
      }
      if (newStringValue.includes("'") || newStringValue.includes('\\')) {
        // don't try to escape stuff in the angular syntax
        // double quotes work btw. because they just end up as &quot;
        return {
          hasSquareBrackets: false,
          value: newStringValue,
        };
      }
      // preserve square bracket notation if possible
      return {
        hasSquareBrackets: true,
        value: `'${newStringValue}'`,
      };
    },
  });
}
