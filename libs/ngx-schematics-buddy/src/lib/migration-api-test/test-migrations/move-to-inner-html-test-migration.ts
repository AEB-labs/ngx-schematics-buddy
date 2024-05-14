import { Rule } from '@angular-devkit/schematics';
import { MoveToInnerHtmlAction } from '../../migrations-api/actions/move-to-inner-html-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveToInnerHtmlAction({
      attributeName: 'nxLabel',
      wrapWithTag: 'lib-field-label',
      conditions: [isNamed('lib-dropdown')],
    }),
    new MoveToInnerHtmlAction({
      attributeName: 'content',
      conditions: [isNamed('div')],
    }),
  ]);
}
