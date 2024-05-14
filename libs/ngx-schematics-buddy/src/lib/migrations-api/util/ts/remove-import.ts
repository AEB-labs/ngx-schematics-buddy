import { UpdateRecorder } from '@angular-devkit/schematics';
import { findImport } from './find-import';

export function removeImport(
  recorder: UpdateRecorder,
  source: string,
  importSpecifier: string,
  packageName: string
) {
  const specifierMatch = findImport(source, packageName, importSpecifier);

  let startRemovePos = 0;
  let endRemovePos = 0;
  if (!specifierMatch?.importSpecifier?.node) {
    return false;
  }

  if (
    specifierMatch.importSpecifier.isFirst &&
    specifierMatch.importSpecifier.isLast
  ) {
    // Only one specifier for import statement -> remove import entirely
    const hasNewLineCharacter =
      source[specifierMatch.importDeclaration.node.end];
    startRemovePos = specifierMatch.importDeclaration.node.pos;
    endRemovePos =
      specifierMatch.importDeclaration.node.end + (hasNewLineCharacter ? 1 : 0);
  } else if (specifierMatch.importSpecifier.isFirst) {
    startRemovePos = specifierMatch.importSpecifier.node.pos;
    endRemovePos = specifierMatch.importSpecifier.node.end + 1;
  } else if (specifierMatch.importSpecifier.isLast) {
    startRemovePos = specifierMatch.importSpecifier.node.pos - 1;
    endRemovePos = specifierMatch.importSpecifier.node.end;
  } else {
    // Specifier is in-between.
    startRemovePos = specifierMatch.importSpecifier.node.pos;
    endRemovePos = specifierMatch.importSpecifier.node.end + 1;
  }

  recorder.remove(startRemovePos, endRemovePos - startRemovePos);
  return true;
}
