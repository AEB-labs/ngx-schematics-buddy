import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { withSquareBrackets } from '../utils';
import { addAttribute } from './add-attribute';
import { AttributeValue, changeAttributeValue } from './change-attribute-value';
import { getAttributeValue } from './get-attribute-value';

/**
 * Sets the value of an attribute with a given name
 *
 * Adds or removes brackets of a potentially existing attribute if needed
 */
export function setAttributeValue(params: {
  recorder: UpdateRecorder;
  element: Element;
  name: string;
  fileContent: string;
  value: AttributeValue;
}) {
  const { recorder, fileContent, element, name, value } = params;

  const existingValue = getAttributeValue({ element: element, name });

  if (!existingValue) {
    addAttribute({
      recorder,
      fileContent,
      element,
      value: value.value,
      attributeName: value.hasSquareBrackets ? withSquareBrackets(name) : name,
    });
    return;
  }

  changeAttributeValue({
    recorder,
    element,
    name,
    changeValue: () => value,
  });
}
