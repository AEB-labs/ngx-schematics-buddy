import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { findChild } from '../helper-functions/find-child';
import { moveAllAttributes } from '../helper-functions/move-all-attributes';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Finds all parent elements matching the provided parentConditions.
 * For the first child element matching the provided childConditions, this moves all attributes to the parent element.
 */
export class MoveAllAttributesToParentAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      childConditions: ReadonlyArray<TemplateActionCondition>;
      parentConditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.parentConditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void {
    const child = findChild(element, parents, this.params.childConditions);
    if (!child) {
      return;
    }
    moveAllAttributes({
      recorder,
      source: child,
      target: element,
      fileContent,
    });
  }
}
