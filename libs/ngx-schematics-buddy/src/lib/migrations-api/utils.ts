import { Element, Node, Text } from '@angular-eslint/bundled-angular-compiler';

export function withSquareBrackets(attribute: string) {
  return `[${withoutSquareBrackets(attribute)}]`;
}

export function withoutSquareBrackets(attribute: string) {
  return attribute.replace(/^\[/, '').replace(/\]$/, '');
}

export function getElements(
  nodes: ReadonlyArray<Node>
): ReadonlyArray<Element> {
  return nodes.filter((node): node is Element => node instanceof Element);
}

export function getTexts(nodes: ReadonlyArray<Node>): ReadonlyArray<Text> {
  return nodes.filter((node): node is Text => node instanceof Text);
}
