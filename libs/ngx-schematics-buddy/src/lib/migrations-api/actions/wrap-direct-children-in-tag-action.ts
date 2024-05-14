import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addInnerHtml } from '../helper-functions/add-inner-html';
import { findElements } from '../helper-functions/find-elements';
import { getRawElement } from '../helper-functions/get-raw-element';
import { removeElement } from '../helper-functions/remove-element';
import { isNamed, TemplateActionCondition } from '../template-action-condition';

/**
 * This will wrap all children of matching elements, that comply to the `childConditions` in a tag
 * with name `wrapperTagName`.
 *
 * It can be configured whether an existing tag should be re-used for wrapping (which result in moving
 * elements) or if a new wrapping tag should be used in all circumstances.
 * See constructor arguments for more details on the configuration options.
 */
export class WrapDirectChildrenInTagAction extends AbstractTemplateAction {
  /**
   * Creates the action
   *
   * @param params The parameters to configure the action
   * @param params.conditions The conditions which to which elements this action should be applied
   * @param params.childConditions The conditions which children of the elements matched by `conditions` should be wrapped
   * @param params.wrapperTagName The name of the tag which should be used to wrap the matching children
   * @param params.useExistingTag Whether to move the elements to an already existing tag with name `wrapperTagName` or to create a new tag in all cases
   * @param params.allowedPaths Restricts the file-paths/file-names onto which this action will be applied
   */
  constructor(
    readonly params: {
      conditions: ReadonlyArray<TemplateActionCondition>;
      childConditions: ReadonlyArray<TemplateActionCondition>;
      wrapperTagName: string;
      useExistingTag?: boolean;
      allowedPaths?: ReadonlyArray<string | RegExp>;
    }
  ) {
    super(params.conditions, params.allowedPaths);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void {
    const children = findElements(
      element.children,
      parents,
      this.params.childConditions,
      true
    );
    if (!children.length) {
      return;
    }
    const rawChildren = children
      .map((child) => getRawElement(child, fileContent))
      .join('\n');
    const childrenContent = `\n${rawChildren}\n`;
    const existingTag = this.params.useExistingTag
      ? findElements(element, parents, [isNamed(this.params.wrapperTagName)])
      : [];
    if (existingTag.length > 0) {
      addInnerHtml({
        recorder,
        content: childrenContent,
        element: existingTag[0],
        location: 'end',
      });
    } else {
      const content = `<${this.params.wrapperTagName}>${childrenContent}</${this.params.wrapperTagName}>\n`;
      addInnerHtml({ recorder, content, element, location: 'end' });
    }
    children.forEach((child) => removeElement({ recorder, element: child }));
  }
}
