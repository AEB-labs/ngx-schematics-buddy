import { Rule } from '@angular-devkit/schematics';
import { RemoveElementTagAction } from '../../migrations-api/actions/remove-element-tag-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RemoveElementTagAction({
      conditions: [isNamed('span')],
    }),
  ]);
}
