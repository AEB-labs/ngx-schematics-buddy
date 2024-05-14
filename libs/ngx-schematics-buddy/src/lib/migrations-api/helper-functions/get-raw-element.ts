import { Element } from '@angular-eslint/bundled-angular-compiler';

export function getRawElement(element: Element, fileContent: string): string {
  if (element.sourceSpan) {
    return fileContent.slice(
      element.sourceSpan.start.offset,
      element.sourceSpan.end.offset
    );
  }
  return '';
}
