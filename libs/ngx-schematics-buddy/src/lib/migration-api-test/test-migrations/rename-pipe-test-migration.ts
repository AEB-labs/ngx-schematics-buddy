import { Rule } from '@angular-devkit/schematics';
import { RenamePipeAction } from '../../migrations-api/actions/rename-pipe-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new RenamePipeAction({
      oldName: 'oldName',
      newName: 'newName',
      conditions: [isNamed('div')],
    }),
    new RenamePipeAction({
      oldName: (name: string) => name.indexOf('special') > -1,
      newName: (oldName: string) => oldName.replace('special', 'specialNew'),
      conditions: [isNamed('div')],
    }),
  ]);
}
