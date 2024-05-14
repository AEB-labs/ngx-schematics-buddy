import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { withoutSquareBrackets, withSquareBrackets } from '../utils';
import { findAttribute } from './find-attribute';

export interface AttributeValue {
  /**
   * The value of the HTML attribute
   */
  readonly value: string;

  /**
   * Indicates whether the attribute name has square brackets
   *
   * if true, the value is an expression. If false, the value is a literal string.
   */
  readonly hasSquareBrackets: boolean;
}

/**
 * Changes the value of an attribute with a given name
 *
 * Existing attributes will be searched case-insensitively. Attributes with square brackets will
 * also be found. In this case, the callback will receive true for hasSquareBrackets. The return
 * value of the callback may have a different value for hasSquareBrackets, in which case the square
 * brackets will be added or removed, respectively.
 *
 * Does nothing if the element does not have an attribute with that name.
 */
export function changeAttributeValue(params: {
  recorder: UpdateRecorder;
  element: Element;
  name: string;
  changeValue: (oldValue: AttributeValue) => AttributeValue;
}) {
  const { recorder, element, name, changeValue } = params;

  const attribute = findAttribute({ element: element, name });
  if (!attribute) {
    return;
  }

  const currentValue: AttributeValue = {
    hasSquareBrackets: attribute.name.startsWith('['),
    value: attribute.value,
  };

  const newValue = changeValue(currentValue);

  // see if square brackets need to be added or removed
  if (newValue.hasSquareBrackets !== currentValue.hasSquareBrackets) {
    const newAttributeName = newValue.hasSquareBrackets
      ? withSquareBrackets(name)
      : withoutSquareBrackets(name);

    const offset = attribute.sourceSpan.start.offset;
    recorder.remove(offset, attribute.name.length);
    recorder.insertRight(offset, newAttributeName);
  }

  // see if the attribute value needs to be changed
  if (newValue.value !== currentValue.value) {
    const offset =
      attribute.sourceSpan.start.offset + attribute.name.length + '="'.length;
    recorder.remove(offset, attribute.value.length);
    recorder.insertRight(offset, newValue.value);
  }
}

/**
 * Tries to parse the attribute value as a literal string
 *
 * Only supports very basic syntax like attr="value" or [attr]="'value'"
 *
 * Fails on the safe side by e.g. not supporting escaped characters at all
 *
 * @param value the string value, or undefined if it could not be parsed as a literal string
 */
export function getLiteralAttributeStringValue(
  value: AttributeValue
): string | undefined {
  if (!value.hasSquareBrackets) {
    return value.value;
  }

  const trimmed = value.value.trim();
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];

  // don't bother with unescaping, we probably would not get it right anyway
  if (trimmed.includes('\\')) {
    return undefined;
  }

  if (first === '"' && last === '"') {
    const contents = trimmed.substring(1, trimmed.length - 1);
    if (contents.includes('"')) {
      return undefined;
    }
    return contents;
  }

  if (first === "'" && last === "'") {
    const contents = trimmed.substring(1, trimmed.length - 1);
    if (contents.includes("'")) {
      return undefined;
    }
    return contents;
  }

  return undefined;
}

/**
 * Tries to parse the attribute value as a bool
 *
 * Only supports correct boolean input syntax: [attr]="true|false"
 *
 * Returns undefined in any other case.
 *
 * @param attributeValue the attribute value
 */
export function getLiteralAttributeBooleanValue(
  attributeValue: AttributeValue
): boolean | undefined {
  const { value, hasSquareBrackets } = attributeValue;
  if (!hasSquareBrackets) {
    return undefined;
  }
  return value === 'true' ? true : value === 'false' ? false : undefined;
}
