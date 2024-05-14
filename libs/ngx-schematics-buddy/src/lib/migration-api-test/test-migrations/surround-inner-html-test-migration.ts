import { Rule } from '@angular-devkit/schematics';
import { SurroundInnerHtmlAction } from '../../migrations-api/actions/surround-inner-html-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new SurroundInnerHtmlAction({
      prefix: '<lib-columns>',
      suffix: '</lib-columns>',
      conditions: [isNamed('lib-table')],
    }),
  ]);
}
