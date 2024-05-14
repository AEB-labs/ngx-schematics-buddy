import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { hasExplicitSelfClosingTag } from './is-self-closing-tag';

export function renameElement(params: {
  recorder: UpdateRecorder;
  element: Element;
  newName: string;
}): void {
  const { recorder, element, newName } = params;

  // rename start tag
  const startIndexOfStartTagName = element.startSourceSpan.start.offset + 1;
  const firstAttributeIndex = indexOfFirstAttribute(element);
  // we either take the lowest offset of any attribute or in case of no attributes the endOffset
  // of the start tag
  const endIndexOfStartTagName = firstAttributeIndex
    ? firstAttributeIndex - 1
    : element.startSourceSpan.end.offset - 1;
  recorder.remove(
    startIndexOfStartTagName,
    endIndexOfStartTagName - startIndexOfStartTagName
  );
  recorder.insertLeft(startIndexOfStartTagName, newName);

  // rename end tag
  if (element.endSourceSpan && !hasExplicitSelfClosingTag(element)) {
    const startIndexOfEndTagName = element.endSourceSpan.start.offset + 2;
    const endIndexOfEndTagName = element.endSourceSpan.end.offset - 1;
    recorder.remove(
      startIndexOfEndTagName,
      endIndexOfEndTagName - startIndexOfEndTagName
    );
    recorder.insertLeft(startIndexOfEndTagName, newName);
  }
}

function indexOfFirstAttribute(element: Element): number | undefined {
  if (element.attrs.length === 0) {
    return undefined;
  }
  return Math.min(...element.attrs.map((attr) => attr.sourceSpan.start.offset));
}
