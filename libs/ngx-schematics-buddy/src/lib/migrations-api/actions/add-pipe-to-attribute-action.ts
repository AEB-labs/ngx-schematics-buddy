import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { findAttribute } from '../helper-functions/find-attribute';
import { removeAttribute } from '../helper-functions/remove-attribute';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Adds the provided pipe to the end of the value of the provided attributeName.
 * Will do nothing if the element does not have the attribute.
 * If the attribute is not in square brackets, they will be added, and the value will be wrapped in single-quotes.
 */
export class AddPipeToAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      attributeName: string;
      pipeName: string;
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
    if (!attribute) {
      return;
    }

    removeAttribute({
      element,
      recorder,
      attributeName: this.params.attributeName,
    });

    const valueWithQuotes = attribute.value.startsWith(`'`)
      ? attribute.value
      : `'${attribute.value}'`;

    const valueString = attribute.name.startsWith('[')
      ? attribute.value
      : valueWithQuotes;

    recorder.insertRight(
      attribute.sourceSpan.start.offset - 1,
      ` [${this.params.attributeName}]="${valueString} | ${this.params.pipeName}"`
    );
  }
}
