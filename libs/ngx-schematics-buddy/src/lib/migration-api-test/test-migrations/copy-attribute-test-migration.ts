import { Rule } from '@angular-devkit/schematics';
import { CopyAttributeAction } from '../../migrations-api/actions/copy-attribute-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new CopyAttributeAction({
      oldName: 'oldName',
      newName: 'newName',
      conditions: [isNamed('div')],
    }),
  ]);
}
