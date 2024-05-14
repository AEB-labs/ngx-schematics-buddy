import { Rule } from '@angular-devkit/schematics';
import { NegateAttributeAction } from '../../migrations-api/actions/negate-attribute-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new NegateAttributeAction({
      attributeName: 'pagination',
      conditions: [isNamed('lib-table')],
    }),
  ]);
}
