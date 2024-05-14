import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Removes inner html of the element.
 */
export function removeInnerHtml(params: {
  recorder: UpdateRecorder;
  element: Element;
}) {
  const { element, recorder } = params;
  try {
    if (element.endSourceSpan) {
      recorder.remove(
        element.startSourceSpan.end.offset,
        element.endSourceSpan.start.offset - element.startSourceSpan.end.offset
      );
    }
  } catch (error) {
    console.warn(error);
  }
}
