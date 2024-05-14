import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { renameElement } from '../helper-functions/rename-element';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * This will rename the tag of an element but keep all attributes and the content.
 */
export class RenameElementAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      newName: string | ((oldName: string) => string);
      conditions: ReadonlyArray<TemplateActionCondition>;
      allowedPaths?: ReadonlyArray<string | RegExp>;
    }
  ) {
    super(params.conditions, params.allowedPaths);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    const newName =
      typeof this.params.newName === 'string'
        ? this.params.newName
        : this.params.newName(element.name);
    renameElement({
      element,
      recorder,
      newName,
    });
  }
}
