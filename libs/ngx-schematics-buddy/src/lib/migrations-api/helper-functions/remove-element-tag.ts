import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

export function removeElementTag(params: {
  recorder: UpdateRecorder;
  element: Element;
}) {
  const { recorder, element } = params;

  const openTagStartOffset = element.startSourceSpan.start.offset;
  const openTagEndOffset = element.startSourceSpan.end.offset;
  const closingTagStartOffset = element.endSourceSpan?.start.offset;
  const closingTagEndOffset = element.endSourceSpan?.end.offset;

  if (openTagStartOffset !== undefined && openTagEndOffset !== undefined) {
    recorder.remove(openTagStartOffset, openTagEndOffset - openTagStartOffset);
  }
  if (
    closingTagStartOffset !== undefined &&
    closingTagEndOffset !== undefined
  ) {
    recorder.remove(
      closingTagStartOffset,
      closingTagEndOffset - closingTagStartOffset
    );
  }
}
