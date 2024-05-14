import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Whether a html tag is explicitly self closed via '/', e.g. <MyComponent/>.
 */
export function hasExplicitSelfClosingTag(element: Element): boolean {
  // the angular compiler html parser emits a closing tag with the same end offset as the start tags
  // end offset when a tag is explicitly self-closed
  return (
    !!element.endSourceSpan &&
    element.startSourceSpan.end.offset === element.endSourceSpan.end.offset
  );
}
