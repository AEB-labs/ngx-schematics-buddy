import { tsquery } from '@phenomnomnominal/tsquery';
import { Node } from 'typescript';

export interface ImportMatchResult {
  importDeclaration: {
    node: Node;
  };
  importSpecifier?: {
    node: Node;
    isFirst: boolean;
    isLast: boolean;
  };
}

export function findImport(
  source: string,
  packageName: string,
  importSpecifier?: string
): ImportMatchResult | undefined {
  const tsAst = tsquery.ast(source);

  // Find import declaration (e.g. import { ... } from 'package')
  const importDeclarationSelector = getImportDeclarationSelector(
    packageName,
    importSpecifier
  );
  const importDeclarationMatch = tsquery.query(
    tsAst,
    importDeclarationSelector
  )[0];
  if (!importDeclarationMatch) {
    // no import found -> return undefined
    return;
  }

  const returnObj: ImportMatchResult = {
    importDeclaration: {
      node: importDeclarationMatch,
    },
  };

  // Find exact importSpecifier (e.g. import { --> ObjectEditor <-- } from '...';)
  if (importSpecifier) {
    const specificNamedImportSelector = getSpecificNamedImportSelector(
      packageName,
      importSpecifier
    );
    const importSpecifierMatch = tsquery.query(
      tsAst,
      specificNamedImportSelector
    )[0];
    // eslint-disable-next-line
    const namedBindingsElements = (importDeclarationMatch as any)?.importClause
      ?.namedBindings?.elements;

    returnObj.importSpecifier = {
      node: importSpecifierMatch,
      isFirst: namedBindingsElements[0].name === importSpecifierMatch,
      isLast:
        namedBindingsElements[namedBindingsElements.length - 1].name ===
        importSpecifierMatch,
    };
  }

  return returnObj;
}

function getIdentifierSelector(importSpecifier?: string) {
  return importSpecifier ? `Identifier[name="${importSpecifier}"]` : undefined;
}

function getImportDeclarationSelector(
  packageName: string,
  importSpecifier?: string
) {
  let selector = `ImportDeclaration:has(StringLiteral[value="${packageName}"])`;
  if (importSpecifier) {
    selector += `:has(${getIdentifierSelector(importSpecifier)})`;
  }
  return selector;
}

function getSpecificNamedImportSelector(
  packageName: string,
  importSpecifier?: string
) {
  let selector = `ImportDeclaration:has(StringLiteral[value="${packageName}"]) ImportClause ImportSpecifier`;
  if (importSpecifier) {
    selector += ` ${getIdentifierSelector(importSpecifier)}`;
  }
  return selector;
}
