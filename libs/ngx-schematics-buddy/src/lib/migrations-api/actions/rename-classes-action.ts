import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { changeClassList } from '../helper-functions/change-class-list';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Replaces class names with other class names
 *
 * mappings should be a map from old class name to new one
 *
 * Doing this instead of several RenameClassActions should improve performance
 *
 * Some situations are unsupported:
 * - attribute binding for class that is not a simple string (nothing will be done)
 * - presence of ngClass or [attr.class] (regular class attribute will be added)
 */
export class RenameClassesAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      readonly mappings: { [color: string]: string };
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
        for (const [oldName, newName] of Object.entries(this.params.mappings)) {
          if (!classes.includes(oldName)) {
            continue;
          }

          if (classes.includes(newName)) {
            // only remove and keep the new one where it already is
            classes = classes.filter((c) => c !== oldName);
          } else {
            // put the new one where the old one was
            classes = classes.map((c) => (c === oldName ? newName : c));
          }
        }
        return classes;
      },
    });
  }
}
