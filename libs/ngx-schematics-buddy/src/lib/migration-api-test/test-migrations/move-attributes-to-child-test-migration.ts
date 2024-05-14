import { Rule } from '@angular-devkit/schematics';
import { MoveAttributesToChildAction } from '../../migrations-api/actions/move-attributes-to-child-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveAttributesToChildAction({
      parentConditions: [isNamed('div')],
      childConditions: [isNamed('span')],
      attributeNames: ['foo', 'bar'],
    }),
  ]);
}
