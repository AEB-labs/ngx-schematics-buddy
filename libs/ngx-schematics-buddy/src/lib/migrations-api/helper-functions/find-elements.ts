import { Element, Node } from '@angular-eslint/bundled-angular-compiler';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Find all elements in a DocumentTree that fit a list of conditions.
 */
export function findElements(
  startNodes: Node | ReadonlyArray<Node>,
  parents: Map<Element, Element>,
  conditions: ReadonlyArray<TemplateActionCondition>,
  onlyDirectChildren = false
): ReadonlyArray<Element> {
  const elements: Element[] = [];

  const visitNodes = (nodes: ReadonlyArray<Node>) => {
    nodes.forEach((node) => {
      if (!(node instanceof Element)) {
        return;
      }
      if (!onlyDirectChildren && node.children) {
        visitNodes(node.children);
      }

      if (conditions.some((condition) => !condition(node, parents))) {
        return;
      } else {
        elements.push(node);
      }
    });
  };

  const startArr: Array<Node> = Array.isArray(startNodes)
    ? startNodes
    : [startNodes];

  visitNodes(startArr);

  return elements;
}
