import { Attribute, Element } from '@angular-eslint/bundled-angular-compiler';
import { withoutSquareBrackets, withSquareBrackets } from '../utils';

/**
 * Finds an attribute by name case-insensitively on an element and its location.
 * It will always find attributes with and without square brackets,
 * no matter if the "name" parameter has square brackets or not.
 * Returns null if the attribute does not exist on the element.
 */
export function findAttribute(params: {
  element: Element;
  name: string;
}): Attribute | null {
  const { element, name } = params;
  return element.attrs.find((attr) => matchName(attr.name, name)) ?? null;
}

/**
 * Finds all attributes by name case-insensitively on an element and its location.
 * It will always find attributes with and without square brackets,
 * no matter if the "name" parameter has square brackets or not.
 */
export function findAttributes(params: {
  element: Element;
  name: (name: string) => boolean;
}): ReadonlyArray<Attribute> {
  const { element, name } = params;
  return element.attrs.filter((attr) => matchName(attr.name, name)) ?? null;
}

function matchName(
  attributeName: string,
  condition: string | ((name: string) => boolean)
): boolean {
  const canonizedAttributeName = attributeName.toLowerCase();
  if (typeof condition === 'string') {
    return (
      canonizedAttributeName ===
        withoutSquareBrackets(condition).toLowerCase() ||
      canonizedAttributeName === withSquareBrackets(condition).toLowerCase()
    );
  }
  return (
    condition(withSquareBrackets(canonizedAttributeName)) ||
    condition(withoutSquareBrackets(canonizedAttributeName))
  );
}
