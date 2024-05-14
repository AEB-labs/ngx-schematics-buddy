import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Adds the content as inner html to the element.
 * For location: 'end', it will be added just before the endTag.
 * For location: 'start', it will be added just after the startTag.
 */
export function addInnerHtml(params: {
  recorder: UpdateRecorder;
  content: string;
  element: Element;
  location: 'start' | 'end';
}) {
  if (!params.element.startSourceSpan) {
    throw new Error(
      `Element ${params.element.name} does not have a start tag.`
    );
  }
  if (!params.element.endSourceSpan) {
    throw new Error(`Element ${params.element.name} does not have a end tag.`);
  }
  if (params.location === 'start') {
    params.recorder.insertRight(
      params.element.startSourceSpan.end.offset,
      params.content
    );
  } else {
    params.recorder.insertLeft(
      params.element.endSourceSpan.start.offset,
      params.content
    );
  }
}
