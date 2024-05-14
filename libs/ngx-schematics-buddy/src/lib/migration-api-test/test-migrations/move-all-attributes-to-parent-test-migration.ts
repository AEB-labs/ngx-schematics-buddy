import { Rule } from '@angular-devkit/schematics';
import { MoveAllAttributesToParentAction } from '../../migrations-api/actions/move-all-attributes-to-parent-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveAllAttributesToParentAction({
      parentConditions: [isNamed('lib-table-section')],
      childConditions: [isNamed('lib-table')],
    }),
  ]);
}
