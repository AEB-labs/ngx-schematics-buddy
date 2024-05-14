import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { changeClassList } from '../helper-functions/change-class-list';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * If a class exists, removes that and adds another one instead
 *
 * Some situations are unsupported:
 * - attribute binding for class that is not a simple string (nothing will be done)
 * - presence of ngClass or [attr.class] (regular class attribute will be added)
 */
export class RenameClassAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      readonly oldName: string;
      readonly newName: string;
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
      update: (classes) => {
        if (classes.includes(this.params.oldName)) {
          if (classes.includes(this.params.newName)) {
            // only remove and keep the new one where it already is
            return classes.filter((c) => c !== this.params.oldName);
          }
          // put the new one where the old one was
          return classes.map((c) =>
            c === this.params.oldName ? this.params.newName : c
          );
        }
        return classes;
      },
    });
  }
}
