import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { findAttribute } from './find-attribute';

/**
 * Appends a text to the value of an attribute.
 * If the element does not have an attribute with the provided name, nothing will be added.
 */
export function appendToAttributeValue(params: {
  recorder: UpdateRecorder;
  attributeName: string;
  appendix: string;
  fileContent: string;
  element: Element;
}) {
  const { recorder, element, attributeName, appendix } = params;
  const attribute = findAttribute({ element, name: attributeName });
  if (!attribute) {
    return;
  }
  const insertOffset = attribute.sourceSpan.end.offset - 1;
  recorder.insertLeft(insertOffset, appendix);
}
