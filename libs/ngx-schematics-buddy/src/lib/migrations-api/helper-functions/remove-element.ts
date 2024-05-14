import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

export function removeElement(params: {
  recorder: UpdateRecorder;
  element: Element;
}) {
  const { recorder, element } = params;

  const offset = element.startSourceSpan.start.offset;
  recorder.remove(offset, element.sourceSpan.end.offset - offset);
}
