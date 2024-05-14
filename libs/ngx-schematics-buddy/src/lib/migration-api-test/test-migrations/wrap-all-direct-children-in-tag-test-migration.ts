import { Rule } from '@angular-devkit/schematics';
import { WrapDirectChildrenInTagAction } from '../../migrations-api/actions/wrap-direct-children-in-tag-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed, or } from '../../migrations-api/template-action-condition';

export default function (): Rule {
  return getRules([
    new WrapDirectChildrenInTagAction({
      conditions: [isNamed('lib-test-parent')],
      childConditions: [
        or(isNamed('lib-test-child-1'), isNamed('lib-test-child-2')),
      ],
      wrapperTagName: 'lib-test-wrapper',
      useExistingTag: true,
    }),
  ]);
}
