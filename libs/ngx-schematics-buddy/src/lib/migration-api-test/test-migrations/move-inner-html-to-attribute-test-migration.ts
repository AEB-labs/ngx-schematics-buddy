import { Rule } from '@angular-devkit/schematics';
import { MoveInnerHtmlToAttributeAction } from '../../migrations-api/actions/move-inner-html-to-attribute-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new MoveInnerHtmlToAttributeAction({
      attributeName: 'label',
      conditions: [isNamed('lib-navigation-item')],
    }),
  ]);
}
