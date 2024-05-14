import { Rule } from '@angular-devkit/schematics';
import { AddClosingTagAction } from '../../migrations-api/actions/add-closing-tag-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new AddClosingTagAction({
      conditions: [isNamed('lib-text-input')],
    }),
  ]);
}
