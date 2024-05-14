import { Rule } from '@angular-devkit/schematics';
import { RenameAttributeAction } from '../../migrations-api/actions/rename-attribute-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RenameAttributeAction({
      oldName: 'oldName',
      newName: 'newName',
      conditions: [isNamed('div')],
    }),
  ]);
}
