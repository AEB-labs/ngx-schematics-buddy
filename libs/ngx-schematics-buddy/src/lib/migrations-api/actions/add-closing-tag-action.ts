import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { hasExplicitSelfClosingTag } from '../helper-functions/is-self-closing-tag';
import { TemplateActionCondition } from '../template-action-condition';

export class AddClosingTagAction extends AbstractTemplateAction {
  constructor(params: { conditions: ReadonlyArray<TemplateActionCondition> }) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    if (hasExplicitSelfClosingTag(element)) {
      recorder.remove(element.startSourceSpan.end.offset - 2, 1);
    }
    if (!element.endSourceSpan || hasExplicitSelfClosingTag(element)) {
      recorder.insertRight(
        element.startSourceSpan.end.offset,
        `</${element.name}>`
      );
    }
  }
}
