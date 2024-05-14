import { Rule } from '@angular-devkit/schematics';
import { MoveChildElementAfterParentAction } from '../../migrations-api/actions/move-child-element-after-parent-action';
import { getRules } from '../../migrations-api/get-rules';
import {
  hasParentWith,
  isNamed,
} from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveChildElementAfterParentAction({
      conditions: [isNamed('span'), hasParentWith([isNamed('div')])],
    }),
  ]);
}
