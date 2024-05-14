import { ClassDeclaration, getDecorators, Node } from 'ng-morph';

export function getInlineTemplate(cls: ClassDeclaration): string | undefined {
  const [decorator] = getDecorators(cls, { name: 'Component' });

  if (!decorator) {
    return undefined;
  }

  const [decoratorArg] = decorator.getArguments();
  if (!decoratorArg || !Node.isObjectLiteralExpression(decoratorArg)) {
    return undefined;
  }

  const property = decoratorArg.getProperty('template');
  if (!property || !Node.isPropertyAssignment(property)) {
    return undefined;
  }

  const propertyInitializer = property.getInitializer();

  if (
    Node.isStringLiteral(propertyInitializer) ||
    Node.isNoSubstitutionTemplateLiteral(propertyInitializer)
  ) {
    return propertyInitializer.getLiteralValue();
  }

  return undefined;
}
