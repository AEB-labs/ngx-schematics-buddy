import { Rule } from '@angular-devkit/schematics';
import { RemoveAttributesAction } from '../../migrations-api/actions/remove-attributes-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RemoveAttributesAction({
      attributeNames: ['attr1', 'attr2'],
      conditions: [isNamed('div')],
    }),
  ]);
}
