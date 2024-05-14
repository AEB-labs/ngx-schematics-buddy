import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Adds a comment before the provided element.
 *
 * The comment will be placed on a newline directly before the start tag of the provided element.
 */
export function addCommentBeforeNode(params: {
  recorder: UpdateRecorder;
  element: Element;
  commentText: string;
}): void {
  const { recorder, element, commentText } = params;
  if (!element.startSourceSpan) {
    return;
  }
  const insertOffset = element.startSourceSpan.start.offset;
  // restore indentation for original node
  const indentation = ' '.repeat(element.startSourceSpan.start.col);
  const content = `<!-- ${commentText} -->\n${indentation}`;
  recorder.insertRight(insertOffset, content);
}
