import { Rule } from '@angular-devkit/schematics';
import { RenameClassAction } from '../../migrations-api/actions/rename-class-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RenameClassAction({
      oldName: 'old',
      newName: 'new',
      conditions: [isNamed('div')],
    }),
  ]);
}
