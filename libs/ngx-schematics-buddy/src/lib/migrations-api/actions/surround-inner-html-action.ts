import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addInnerHtml } from '../helper-functions/add-inner-html';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Surrounds the innerHtml of the element with the provided prefix and suffix.
 */
export class SurroundInnerHtmlAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      prefix: string;
      suffix: string;
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
    addInnerHtml({
      element,
      recorder,
      location: 'start',
      content: this.params.prefix,
    });
    addInnerHtml({
      element,
      recorder,
      location: 'end',
      content: this.params.suffix,
    });
  }
}
