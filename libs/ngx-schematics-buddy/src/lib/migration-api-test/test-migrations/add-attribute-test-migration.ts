import { Rule } from '@angular-devkit/schematics';
import { AddAttributeAction } from '../../migrations-api/actions/add-attribute-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new AddAttributeAction({
      attribute: 'class',
      value: 'row',
      conditions: [isNamed('div')],
    }),
    new AddAttributeAction({
      attribute: '[value]',
      value: `'aString'`,
      conditions: [isNamed('input')],
    }),
  ]);
}
