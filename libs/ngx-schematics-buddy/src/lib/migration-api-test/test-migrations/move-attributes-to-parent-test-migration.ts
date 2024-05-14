import { Rule } from '@angular-devkit/schematics';
import { MoveAttributesToParentAction } from '../../migrations-api/actions/move-attributes-to-parent-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveAttributesToParentAction({
      parentConditions: [isNamed('div')],
      childConditions: [isNamed('span')],
      attributeNames: ['foo', 'bar'],
    }),
  ]);
}
