import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { findAttribute } from './find-attribute';

/**
 * Remove an attribute from the provided element.
 * This will remove the attribute if it has square brackets.
 * Does nothing if the element does not have an attribute with this name.
 */
export function removeAttribute(params: {
  recorder: UpdateRecorder;
  element: Element;
  attributeName: string;
}) {
  const { recorder, element, attributeName } = params;

  const attribute = findAttribute({ element: element, name: attributeName });
  if (!attribute) {
    return;
  }

  const offset = attribute.sourceSpan.start.offset - 1; // -1 to remove space

  recorder.remove(offset, attribute.sourceSpan.end.offset - offset);
}
