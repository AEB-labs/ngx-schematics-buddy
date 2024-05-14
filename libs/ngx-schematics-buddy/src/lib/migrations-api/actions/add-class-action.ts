import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { changeClassList } from '../helper-functions/change-class-list';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Adds a class name to an element
 *
 * Some situations are unsupported:
 * - attribute binding for class that is not a simple string (nothing will be done)
 * - presence of ngClass or [attr.class] (regular class attribute will be added)
 */
export class AddClassAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      readonly className: string;
      readonly conditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void {
    changeClassList({
      element,
      recorder,
      fileContent,
      update: (classes) => [...classes, this.params.className],
    });
  }
}
