import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { findAttribute } from '../helper-functions/find-attribute';
import { removeAttribute } from '../helper-functions/remove-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Negates the value of an attribute. Attributes without square brackets will be ignored.
 */
export class NegateAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      attributeName: string;
      conditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    const attribute = findAttribute({
      element,
      name: this.params.attributeName,
    });
    if (!attribute || !attribute.name.startsWith('[')) {
      return;
    }
    removeAttribute({
      element,
      recorder,
      attributeName: this.params.attributeName,
    });

    const value =
      attribute.value === 'true'
        ? 'false'
        : attribute.value === 'false'
        ? 'true'
        : `!${attribute.value}`;
    recorder.insertRight(
      attribute.sourceSpan.start.offset - 1,
      ` [${this.params.attributeName}]="${value}"`
    );
  }
}
