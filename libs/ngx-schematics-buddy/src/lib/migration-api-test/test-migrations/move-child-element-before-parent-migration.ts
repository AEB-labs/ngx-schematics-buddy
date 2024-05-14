import { Rule } from '@angular-devkit/schematics';
import { MoveChildElementBeforeParentAction } from '../../migrations-api/actions/move-child-element-before-parent-action';
import { getRules } from '../../migrations-api/get-rules';
import {
  hasParentWith,
  isNamed,
} from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveChildElementBeforeParentAction({
      conditions: [isNamed('span'), hasParentWith([isNamed('div')])],
    }),
  ]);
}
