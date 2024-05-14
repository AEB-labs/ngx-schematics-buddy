import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { AbstractFileAction } from '../abstract-file-action';

interface Item {
  readonly regex: RegExp;
  readonly replacement: string;
}

/**
 * Does a series of literal replacements in a file
 */
export class ReplaceStringsAction extends AbstractFileAction {
  private readonly items: ReadonlyArray<Item>;

  constructor(
    readonly params: {
      readonly fileExtension: string;
      readonly replacements: { [old: string]: string };
    }
  ) {
    super({ fileExtension: params.fileExtension });
    this.items = Object.entries(params.replacements).map(
      ([oldString, newString]) => ({
        regex: new RegExp(escapeRegExp(oldString), 'g'),
        replacement: newString,
      })
    );
  }

  protected migrateFile(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    fileContent: string
  ) {
    let newContent = fileContent;
    for (const item of this.items) {
      newContent = newContent.replace(item.regex, item.replacement);
    }
    if (newContent !== fileContent) {
      recorder.remove(0, fileContent.length);
      recorder.insertLeft(0, newContent);
    }
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
