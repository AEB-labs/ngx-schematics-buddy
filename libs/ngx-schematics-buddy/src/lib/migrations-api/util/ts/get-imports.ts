import { tsquery } from '@phenomnomnominal/tsquery';

export function getImports(source: string) {
  const ast = tsquery.ast(source);
  return tsquery.query(ast, `ImportDeclaration`);
}
