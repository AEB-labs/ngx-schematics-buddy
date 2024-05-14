import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Adds raw content after an element.
 */
export function addBeforeElement(params: {
  recorder: UpdateRecorder;
  content: string;
  element: Element;
}) {
  if (!params.element.startSourceSpan) {
    throw new Error(
      `Element ${params.element.startSourceSpan} does not have a start tag.`
    );
  }
  params.recorder.insertLeft(
    params.element.startSourceSpan.start.offset,
    params.content
  );
}
