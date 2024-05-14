import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { TemplateActionCondition } from '../template-action-condition';

/**
 * Surrounds the tag of the element with the provided tag.
 */
export class SurroundElementAction extends AbstractTemplateAction {
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
    if (element.sourceSpan) {
      recorder.insertLeft(element.sourceSpan.start.offset, this.params.prefix);
      recorder.insertRight(element.sourceSpan.end.offset, this.params.suffix);
    }
  }
}
