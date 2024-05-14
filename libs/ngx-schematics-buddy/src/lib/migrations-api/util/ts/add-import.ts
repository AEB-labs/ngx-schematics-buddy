import { UpdateRecorder } from '@angular-devkit/schematics';
import { ImportDeclaration, NamedImports, Node, SyntaxKind } from 'typescript';
import { findImport } from './find-import';
import { getImports } from './get-imports';

export function addImport(
  recorder: UpdateRecorder,
  source: string,
  importSpecifier: string,
  packageName: string
) {
  const match = findImport(source, packageName);

  if (!match) {
    const importDeclarationNodes = getImports(source);
    const lastImportDeclaration =
      importDeclarationNodes[importDeclarationNodes.length - 1];
    let index = 0;
    if (lastImportDeclaration) {
      index = lastImportDeclaration.end;
    }
    createImportDeclaration(recorder, packageName, importSpecifier, index);
  } else {
    alterImportDeclaration(
      recorder,
      match.importDeclaration.node,
      importSpecifier
    );
  }
}

function createImportDeclaration(
  recorder: UpdateRecorder,
  packageName: string,
  importSpecifier: string,
  index: number
) {
  const importStr = `import { ${importSpecifier} } from '${packageName}';`;
  if (index === 0) {
    recorder.insertLeft(index, `${importStr}`);
  } else {
    recorder.insertLeft(index, `\n${importStr}`);
  }
}

function alterImportDeclaration(
  recorder: UpdateRecorder,
  importDeclarationNode: Node,
  importSpecifier: string
) {
  if (importDeclarationNode.kind !== SyntaxKind.ImportDeclaration) {
    return;
  }
  const node = importDeclarationNode as ImportDeclaration;
  const namedImports = node.importClause?.namedBindings as NamedImports;
  const lastImport = namedImports.elements[namedImports.elements.length - 1];

  recorder.insertLeft(lastImport.end, `, ${importSpecifier}`);
}
