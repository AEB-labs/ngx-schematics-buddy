import { UpdateRecorder } from '@angular-devkit/schematics';
import { Attribute, Element } from '@angular-eslint/bundled-angular-compiler';
import { withoutSquareBrackets, withSquareBrackets } from '../utils';
import { findAttribute, findAttributes } from './find-attribute';

/**
 * Rename one or more attributes of an element. Existing attributes will be searched case-insensitively.
 * This will also rename the attribute if it has square brackets. In that case those will be kept.
 * Does nothing if the element does not have an attribute with that name.
 */
export function renameAttributes(params: {
  recorder: UpdateRecorder;
  element: Element;
  oldName: string | ((attributeName: string) => boolean);
  newName: string | ((oldName: string) => string);
}) {
  const { recorder, element, oldName, newName } = params;

  let matches: ReadonlyArray<Attribute> = [];

  if (typeof oldName === 'string') {
    const res = findAttribute({ element, name: oldName });
    if (res) {
      matches = [res];
    }
  } else {
    matches = findAttributes({
      element: element,
      name: oldName,
    });
  }

  for (const match of matches) {
    const resolvedNewName =
      typeof newName === 'function' ? newName(match.name) : newName;

    const actualNewName = match.name.startsWith('[')
      ? withSquareBrackets(resolvedNewName)
      : withoutSquareBrackets(resolvedNewName);
    const offset = match.sourceSpan.start.offset;

    recorder.remove(offset, match.name.length);
    recorder.insertRight(offset, actualNewName);
  }
}
