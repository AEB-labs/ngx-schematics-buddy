import { Rule } from '@angular-devkit/schematics';
import { AddMigrationCommentAction } from '../../migrations-api/actions/add-migration-comment-action';
import { getRules } from '../../migrations-api/get-rules';
import { isNamed, or } from '../../migrations-api/template-action-condition';

export const migrationCommentText =
  'This is some text that should describe parts where e.g. a full migration is not possible';

export default function (): Rule {
  return getRules([
    new AddMigrationCommentAction({
      migrationCommentVersion: 6,
      migrationCommentText,
      conditions: [or(isNamed('lib-dropdown'), isNamed('lib-text-input'))],
    }),
  ]);
}
