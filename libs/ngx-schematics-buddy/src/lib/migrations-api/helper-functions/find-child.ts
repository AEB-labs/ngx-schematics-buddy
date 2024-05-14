import { Element } from '@angular-eslint/bundled-angular-compiler';
import { TemplateActionCondition } from '../template-action-condition';
import { getElements } from '../utils';

/**
 * Find a direct child element that matches the provided conditions.
 */
export function findChild(
  element: Element,
  parents: Map<Element, Element>,
  conditions: ReadonlyArray<TemplateActionCondition>
): Element | null {
  return (
    getElements(element.children).find((child) =>
      conditions.every((condition) => condition(child, parents))
    ) ?? null
  );
}
