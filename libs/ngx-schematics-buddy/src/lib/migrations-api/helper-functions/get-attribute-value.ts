import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AttributeValue } from './change-attribute-value';
import { findAttribute } from './find-attribute';

/**
 * Finds an attribute with or without square brackets and extracts its value
 */
export function getAttributeValue(params: {
  element: Element;
  name: string;
}): AttributeValue | undefined {
  const attribute = findAttribute(params);
  if (!attribute) {
    return undefined;
  }
  return {
    value: attribute.value,
    hasSquareBrackets: attribute.name.startsWith('['),
  };
}
