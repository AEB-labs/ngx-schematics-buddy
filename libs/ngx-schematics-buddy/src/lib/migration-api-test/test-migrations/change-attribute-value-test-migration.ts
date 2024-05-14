import { Rule } from '@angular-devkit/schematics';
import { ChangeAttributeValueAction } from '../../migrations-api/actions/change-attribute-value-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new ChangeAttributeValueAction({
      name: 'attr',
      changeValue: ({ value, hasSquareBrackets }) => ({
        value: 'prefix ' + value + ' suffix',
        hasSquareBrackets: !hasSquareBrackets,
      }),
      conditions: [isNamed('my-elem')],
    }),
  ]);
}
