import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Adds an attribute to the provided element.
 * If square brackets are needed they must be included in "attribute".
 * If the value is undefined the attribute will be added without any value (e.g. <input required>).
 */
export function addAttribute(params: {
  recorder: UpdateRecorder;
  attributeName: string;
  value: string | undefined;
  fileContent: string;
  element: Element;
}) {
  const { recorder, element, attributeName, value } = params;
  if (!element.startSourceSpan) {
    return;
  }

  let insertOffset = element.startSourceSpan.end.offset - 1;
  // the angular html parser sets the endSourceSpan when a slash is included, e.g. <input />
  // it can be detected by comparing the endOffset of both spans which are identical in this case
  if (
    element.startSourceSpan &&
    element.endSourceSpan &&
    element.startSourceSpan.end.offset === element.endSourceSpan.end.offset
  ) {
    insertOffset = element.startSourceSpan.end.offset - 2;
  }
  recorder.insertRight(
    insertOffset,
    value !== undefined ? ` ${attributeName}="${value}"` : ` ${attributeName}`
  );
}
