import { Rule } from '@angular-devkit/schematics';
import { RemoveElementAction } from '../../migrations-api/actions/remove-element-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RemoveElementAction({
      conditions: [isNamed('span')],
    }),
  ]);
}
