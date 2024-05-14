import { Rule } from '@angular-devkit/schematics';
import { AddAttributeAction } from '../../migrations-api/actions/add-attribute-action';
import { RemoveAttributesAction } from '../../migrations-api/actions/remove-attributes-action';
import { getRules } from '../../migrations-api/get-rules';
import {
  hasAttributeValue,
  hasBooleanAttributeValue,
  hasChildWith,
  hasNumberAttributeValue,
  hasParentWith,
  isNamed,
} from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new AddAttributeAction({
      attribute: 'class',
      value: 'test',
      conditions: [isNamed('div')],
    }),
    new AddAttributeAction({
      attribute: 'class',
      value: 'test',
      conditions: [
        isNamed('input'),
        hasAttributeValue({ attributeName: 'value', value: 'test' }),
      ],
    }),
    new AddAttributeAction({
      attribute: '[isTrue]',
      value: 'true',
      conditions: [
        isNamed('input'),
        hasBooleanAttributeValue({ attributeName: 'isFalse', value: false }),
      ],
    }),
    new AddAttributeAction({
      attribute: 'quantity',
      value: 'fifteen',
      conditions: [
        isNamed('input'),
        hasNumberAttributeValue({ attributeName: 'count', value: 15 }),
      ],
    }),
    new RemoveAttributesAction({
      attributeNames: ['isFalse'],
      conditions: [
        isNamed('input'),
        hasBooleanAttributeValue({ attributeName: 'isFalse', value: false }),
      ],
    }),
    new RemoveAttributesAction({
      attributeNames: ['count'],
      conditions: [
        isNamed('input'),
        hasNumberAttributeValue({ attributeName: 'count', value: 15 }),
      ],
    }),
    new AddAttributeAction({
      attribute: 'class',
      value: 'test',
      conditions: [
        isNamed('lib-field-label'),
        hasParentWith([isNamed('lib-dropdown')]),
      ],
    }),
    new AddAttributeAction({
      attribute: 'class',
      value: 'test',
      conditions: [
        isNamed('lib-text-input'),
        hasChildWith([isNamed('lib-field-label')]),
      ],
    }),
  ]);
}
