import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { addAttribute } from './add-attribute';
import { changeLiteralStringAttribute } from './change-literal-string-attribute';
import { findAttribute } from './find-attribute';
import { removeAttribute } from './remove-attribute';

/**
 * Changes the list of class names of an element
 *
 * Some situations are unsupported:
 * - attribute binding for class that is not a simple string (nothing will be done)
 * - presence of ngClass or [attr.class] (regular class attribute will be added)
 */
export function changeClassList(params: {
  readonly recorder: UpdateRecorder;
  readonly element: Element;
  readonly fileContent: string;
  readonly update: (classList: ReadonlyArray<string>) => ReadonlyArray<string>;
}) {
  const attributeName = 'class';
  const attr = findAttribute({ element: params.element, name: attributeName });
  if (!attr) {
    const newClassList = params.update([]);

    // don't add class=""
    if (newClassList.length) {
      addAttribute({
        recorder: params.recorder,
        element: params.element,
        attributeName,
        value: serializeClassList(newClassList),
        fileContent: params.fileContent,
      });
    }
    return;
  }

  // a bit messy, but it lets us use the changeLiteralStringAttribute function which helps
  let shouldRemove = false;

  changeLiteralStringAttribute({
    element: params.element,
    recorder: params.recorder,
    name: attributeName,
    changeValue: (classListStr) => {
      const oldClassList = classListStr.split(' ');
      const newClassList = params.update(oldClassList);
      if (newClassList === oldClassList) {
        // fast lane
        return classListStr;
      }
      if (!newClassList.length) {
        // don't change, we'll remove it anyway
        shouldRemove = true;
        return classListStr;
      }
      return serializeClassList(params.update(oldClassList));
    },
  });

  if (shouldRemove) {
    removeAttribute({
      element: params.element,
      recorder: params.recorder,
      attributeName,
    });
  }
}

function serializeClassList(classList: ReadonlyArray<string>) {
  return Array.from(new Set(classList))
    .filter((c) => !!c)
    .join(' ');
}
