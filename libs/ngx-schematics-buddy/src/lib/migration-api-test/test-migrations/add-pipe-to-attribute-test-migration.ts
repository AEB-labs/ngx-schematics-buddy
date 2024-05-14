import { Rule } from '@angular-devkit/schematics';
import { AddPipeToAttributeAction } from '../../migrations-api/actions/add-pipe-to-attribute-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new AddPipeToAttributeAction({
      attributeName: 'dataKey',
      pipeName: 'resolveFieldFn',
      conditions: [isNamed('lib-table')],
    }),
  ]);
}
