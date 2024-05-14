import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element, Text } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { TemplateActionCondition } from '../template-action-condition';

const PIPE_REGEX = /\S*\s?\|\s?(\w+)/g;

/**
 * Rename one or more pipes applied onto an element that matches the given conditions. On a matched
 * element, the action crawls all attributes and direct child nodes of type Text (since other types
 * of nodes will be handled by a separate invocation of the action) which feature an interpolation.
 */
export class RenamePipeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      readonly oldName: string | ((name: string) => boolean);
      readonly newName: string | ((oldName: string) => string);
      readonly conditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element
  ): void {
    const { oldName, newName } = this.params;
    for (const attribute of element.attrs) {
      // only apply on attributes if we have an interpolation
      if (
        !attribute.name.startsWith('[') ||
        !attribute.name.endsWith(']') ||
        !attribute.valueSpan
      ) {
        continue;
      }
      replacePipeName(
        attribute.value,
        attribute.valueSpan.start.offset,
        oldName,
        newName,
        recorder
      );
    }

    for (const text of element.children.filter(
      (child): child is Text => child instanceof Text
    )) {
      for (const token of text.tokens) {
        if (
          token.parts.length === 3 &&
          token.parts[0] === '{{' &&
          token.parts[2] === '}}'
        ) {
          // + 2 because of the interpolation start brackets. Any following whitespace is
          // part of the actual value of the interpolation
          replacePipeName(
            token.parts[1],
            token.sourceSpan.start.offset + 2,
            oldName,
            newName,
            recorder
          );
        }
      }
    }
  }
}

function replacePipeName(
  valueStr: string,
  baseIndex: number,
  oldName: string | ((oldName: string) => boolean),
  newName: string | ((oldName: string) => string),
  recorder: UpdateRecorder
): void {
  const matches = Array.from(valueStr.matchAll(PIPE_REGEX));
  for (const match of matches) {
    const index = valueStr.indexOf(match[1]);
    const oldNameMatch =
      (typeof oldName === 'string' && match[1] === oldName) ||
      (typeof oldName === 'function' && oldName(match[1]));
    if (oldNameMatch) {
      recorder.remove(baseIndex + index, match[1].length);
      const resolvedNewName =
        typeof newName === 'string' ? newName : newName(match[1]);
      recorder.insertRight(baseIndex + index, resolvedNewName);
    }
  }
}
