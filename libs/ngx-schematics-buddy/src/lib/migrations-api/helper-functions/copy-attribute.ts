import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { withoutSquareBrackets, withSquareBrackets } from '../utils';
import { findAttribute } from './find-attribute';

/**
 * Copies the value of an existing attribute to a new attribute without removing the existing one.
 * Existing attributes will be searched case-insensitively.
 * This will also copy the attribute if it has square brackets. In that case those will be kept
 * in the copied attribute.
 * Does nothing if the element does not have an attribute with that name.
 */
export function copyAttribute(params: {
  recorder: UpdateRecorder;
  element: Element;
  oldName: string;
  newName: string;
}) {
  const { recorder, element, oldName, newName } = params;

  const attribute = findAttribute({ element: element, name: oldName });
  if (!attribute) {
    return;
  }

  const actualNewName = attribute.name.startsWith('[')
    ? withSquareBrackets(newName)
    : withoutSquareBrackets(newName);
  const endOffset = attribute.sourceSpan.end.offset;

  const actualValue = attribute.value ? `="${attribute.value}"` : '';

  recorder.insertRight(endOffset, ` ${actualNewName}${actualValue}`);
}
