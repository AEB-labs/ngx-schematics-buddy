import { Rule } from '@angular-devkit/schematics';
import { ReplaceStringsAction } from '../../migrations-api/actions/replace-strings-action';
import { getRules } from '../../migrations-api/get-rules';

export default function (): Rule {
  return getRules([
    new ReplaceStringsAction({
      replacements: {
        $abc: '$def',
      },
      fileExtension: '.scss',
    }),
  ]);
}
