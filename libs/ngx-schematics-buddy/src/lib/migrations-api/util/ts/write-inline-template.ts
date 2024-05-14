import { ClassDeclaration, getDecorators, Node } from 'ng-morph';

export function writeInlineTemplate(
  cls: ClassDeclaration,
  contents: string
): void {
  const [decorator] = getDecorators(cls, { name: 'Component' });

  if (!decorator) {
    return;
  }

  const [decoratorArg] = decorator.getArguments();
  if (!decoratorArg || !Node.isObjectLiteralExpression(decoratorArg)) {
    return;
  }

  const property = decoratorArg.getProperty('template');
  if (!property || !Node.isPropertyAssignment(property)) {
    return;
  }

  const propertyInitializer = property.getInitializer();

  if (
    Node.isStringLiteral(propertyInitializer) ||
    Node.isNoSubstitutionTemplateLiteral(propertyInitializer)
  ) {
    propertyInitializer.setLiteralValue(contents);
  }
}
