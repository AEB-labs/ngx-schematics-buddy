import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Adds raw content after an element.
 */
export function addAfterElement(params: {
  recorder: UpdateRecorder;
  content: string;
  element: Element;
}) {
  if (!params.element.endSourceSpan) {
    throw new Error(`Element ${params.element.name} does not have a end tag.`);
  }
  params.recorder.insertRight(
    params.element.endSourceSpan.end.offset,
    params.content
  );
}
