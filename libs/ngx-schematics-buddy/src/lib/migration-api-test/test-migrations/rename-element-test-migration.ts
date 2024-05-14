import { Rule } from '@angular-devkit/schematics';
import { RenameElementAction } from '../../migrations-api/actions/rename-element-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RenameElementAction({
      newName: 'lib-dropdown',
      conditions: [isNamed('p-dropdown')],
    }),
  ]);
}
