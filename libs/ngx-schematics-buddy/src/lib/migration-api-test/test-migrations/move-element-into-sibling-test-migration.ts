import { Rule } from '@angular-devkit/schematics';
import { MoveElementIntoSiblingAction } from '../../migrations-api/actions/move-element-into-sibling-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveElementIntoSiblingAction({
      conditions: [isNamed('span')],
      siblingConditions: [isNamed('div')],
    }),
  ]);
}
