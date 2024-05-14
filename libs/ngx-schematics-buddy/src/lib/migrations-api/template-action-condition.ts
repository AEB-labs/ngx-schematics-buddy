import { Element, Node, Text } from '@angular-eslint/bundled-angular-compiler';
import { findAttribute } from './helper-functions/find-attribute';
import { getAttributeValue } from './helper-functions/get-attribute-value';

export type TemplateActionCondition = (
  element: Element,
  parents: Map<Element, Element>
) => boolean;

/**
 * Applies to all elements that match the provided name case insensitively.
 */
export function isNamed(name: string): TemplateActionCondition {
  return (element: Element) => {
    return element.name.toLowerCase() === name.toLowerCase();
  };
}

export function nameStartsWith(name: string): TemplateActionCondition {
  return (element: Element) => {
    return element.name.toLowerCase().startsWith(name.toLowerCase());
  };
}

/**
 * Applies to all elements that have a parent that fulfills all the provided conditions.
 */
export function hasParentWith(
  parentConditions: ReadonlyArray<TemplateActionCondition>
) {
  return function (element: Element, parents: Map<Element, Element>) {
    const parent = parents.get(element);
    if (!parent) {
      return false;
    }
    return parentConditions.every((condition) => condition(parent, parents));
  };
}

/**
 * Applies to all elements that have an ancestor that fulfills all the provided conditions.
 */
export function hasAncestorWith(
  parentConditions: ReadonlyArray<TemplateActionCondition>
) {
  function hasParent(
    element: Element,
    parents: Map<Element, Element>
  ): boolean {
    const parent = parents.get(element);
    if (!parent) {
      return false;
    }
    return (
      parentConditions.every((condition) => condition(parent, parents)) ||
      hasParent(parent, parents)
    );
  }

  return hasParent;
}

/**
 * Applies to all elements that have text content, such as span in `<span>Text</span>`.
 */
export function hasTextContent() {
  return function (element: Element) {
    return (element.children ?? []).some((child) => child instanceof Text);
  };
}

/**
 * Applies to all elements that have non-whitespace content
 */
export function hasContent() {
  return function (element: Element) {
    return (element.children ?? []).some(
      (node: Node) =>
        node instanceof Element ||
        (node instanceof Text && !!node.value.trim().length)
    );
  };
}

/**
 * Applies to all elements that have a child element
 */
export function hasChildElement() {
  return function (element: Element) {
    return (element.children ?? []).some((node) => node instanceof Element);
  };
}

/**
 * Applies to all elements that have a child that fulfills all the provided conditions.
 */
export function hasChildWith(
  childConditions: ReadonlyArray<TemplateActionCondition>
) {
  return function (element: Element, parents: Map<Element, Element>) {
    return (element.children ?? [])
      .filter((node): node is Element => node instanceof Element)
      .some((childNode) =>
        childConditions.every((condition) => condition(childNode, parents))
      );
  };
}

/**
 * Applies to all elements that have exactly one child that fulfills all the provided conditions.
 */
export function hasSingleChildWith(
  childConditions: ReadonlyArray<TemplateActionCondition>
) {
  return function (element: Element, parents: Map<Element, Element>) {
    return (
      (element.children ?? [])
        .filter((node): node is Element => node instanceof Element)
        .filter((childNode) =>
          childConditions.every((condition) => condition(childNode, parents))
        ).length === 1
    );
  };
}

/**
 * Applies to all elements that have an attribute with the provided attributeName,
 * and the provided string value.
 * Also applies to elements that have the attribute in square brackets, and the value in single quotes.
 */
export function hasAttributeValue(params: {
  attributeName: string;
  value: string | undefined;
}): TemplateActionCondition {
  return (element: Element) => {
    const attribute = findAttribute({ element, name: params.attributeName });
    if (!attribute) {
      return false;
    }
    if (attribute.name.startsWith('[')) {
      if (params.attributeName.startsWith('[')) {
        return attribute.value === params.value;
      } else {
        return attribute.value === `'${params.value}'`;
      }
    } else {
      return attribute.value === params.value;
    }
  };
}

/**
 * Applies to all elements that have an attribute with the provided attributeName,
 * and the provided boolean value.
 */
export function hasBooleanAttributeValue(params: {
  attributeName: string;
  value: boolean;
}): TemplateActionCondition {
  return (element: Element) => {
    const attribute = findAttribute({
      element: element,
      name: params.attributeName,
    });
    if (!attribute || !attribute.name.startsWith('[')) {
      return false;
    }
    const boolValue =
      attribute.value === 'true'
        ? true
        : attribute.value === 'false'
        ? false
        : undefined;
    return boolValue === params.value;
  };
}

/**
 * Applies to all elements that have an attribute with the provided attributeName,
 * and the provided number value.
 * Also applies to valid string representations of number values (matches both 15 and "15").
 */
export function hasNumberAttributeValue(params: {
  attributeName: string;
  value: number | undefined;
}): TemplateActionCondition {
  return (element: Element) => {
    const attribute = findAttribute({
      element: element,
      name: params.attributeName,
    });
    const attributeValue = attribute?.value as string | number;
    if (!attribute || typeof attributeValue === 'number') {
      return false;
    }
    return Number(attributeValue) === params.value;
  };
}

/**
 * Applies to all elements that have the provided attribute.
 * This also matches attributes with square brackets and is case-insensitive.
 */
export function hasAttribute(attributeName: string): TemplateActionCondition {
  return (element: Element) =>
    !!findAttribute({ element: element, name: attributeName });
}

/**
 * Applies to all elements that have the same values for the given attributes.
 *
 * If one of the attributes is not found on the element, returns false.
 */
export function hasAttributesWithSameValues(
  attributeNames: string[]
): TemplateActionCondition {
  return (element: Element) => {
    const attributeValues = new Set<string>();
    for (const attributeName of attributeNames) {
      const attributeValue = getAttributeValue({
        element,
        name: attributeName,
      });
      if (!attributeValue) {
        return false;
      }
      // If the attribute uses square brackets but the value is a literal string, remove the
      // single ticks to make values comparable
      if (
        attributeValue.hasSquareBrackets &&
        attributeValue.value.startsWith("'") &&
        attributeValue.value.endsWith("'")
      ) {
        attributeValues.add(
          attributeValue.value.slice(1, attributeValue.value.length - 1)
        );
      } else {
        attributeValues.add(attributeValue.value);
      }
    }
    return attributeValues.size === 1;
  };
}

/**
 * Inverts a condition.
 */
export function not(
  condition: TemplateActionCondition
): TemplateActionCondition {
  return (element: Element, parents: Map<Element, Element>) => {
    return !condition(element, parents);
  };
}

/**
 * Combines a list of conditions with or.
 */
export function or(
  ...conditions: ReadonlyArray<TemplateActionCondition>
): TemplateActionCondition {
  return (element: Element, parents: Map<Element, Element>) => {
    return conditions.some((condition) => condition(element, parents));
  };
}

/**
 * Combines a list of conditions with and.
 */
export function and(
  ...conditions: ReadonlyArray<TemplateActionCondition>
): TemplateActionCondition {
  return (element: Element, parents: Map<Element, Element>) => {
    return conditions.every((condition) => condition(element, parents));
  };
}
