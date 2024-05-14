import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';

/**
 * Moves all attributes from one element to another.
 */
export function moveAllAttributes(params: {
  recorder: UpdateRecorder;
  source: Element;
  target: Element;
  fileContent: string;
}) {
  const { recorder, source, target, fileContent } = params;

  if (source.attrs.length === 0) {
    return;
  }

  const startOffset =
    Math.min(...source.attrs.map((attr) => attr.sourceSpan.start.offset)) - 1; // -1 to remove space before attribute
  const endOffset = Math.max(
    ...source.attrs.map((attr) => attr.sourceSpan.end.offset)
  );
  const attributeString = fileContent.slice(startOffset, endOffset);
  recorder.remove(startOffset, endOffset - startOffset);
  recorder.insertLeft(target.startSourceSpan.end.offset - 1, attributeString);
}
