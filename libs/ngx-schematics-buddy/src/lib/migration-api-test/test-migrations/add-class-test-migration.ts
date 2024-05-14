import { Rule } from '@angular-devkit/schematics';
import { AddClassAction } from '../../migrations-api/actions/add-class-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new AddClassAction({
      className: 'foo',
      conditions: [isNamed('div')],
    }),
  ]);
}
