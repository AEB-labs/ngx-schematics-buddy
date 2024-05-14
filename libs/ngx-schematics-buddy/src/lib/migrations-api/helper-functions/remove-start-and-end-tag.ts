import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Removes the start and end tag for an element, effectively replacing it with its inner html
 */
export function removeStartAndEndTag(params: {
  recorder: UpdateRecorder;
  element: Element;
}) {
  const { recorder, element } = params;
  if (element.endSourceSpan) {
    const startTagStartOffset = element.startSourceSpan.start.offset;
    const startTagEndOffset = element.startSourceSpan.end.offset;
    const endTagStartOffset = element.endSourceSpan.start.offset;
    const endTagEndOffset = element.endSourceSpan.end.offset;
    recorder.remove(
      startTagStartOffset,
      startTagEndOffset - startTagStartOffset
    );
    recorder.remove(endTagStartOffset, endTagEndOffset - endTagStartOffset);
  }
}
