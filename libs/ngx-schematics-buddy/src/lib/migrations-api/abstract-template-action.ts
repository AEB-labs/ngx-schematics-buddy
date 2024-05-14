import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import {
  Element,
  HtmlParser,
  Node,
  ParseLocation,
  ParseSourceFile,
  ParseSourceSpan,
  ParseTreeResult,
} from '@angular-eslint/bundled-angular-compiler';
import {
  createProject,
  getActiveProject,
  getClasses,
  setActiveProject,
} from 'ng-morph';
import { basename, join } from 'path';
import { findProjectPaths, findTemplates } from './util/schematic-utils';
import { getInlineTemplate } from './util/ts/get-inline-template';
import { writeInlineTemplate } from './util/ts/write-inline-template';
import { AbstractMigrationAction } from './abstract-migration-action';
import { findElements } from './helper-functions/find-elements';
import { TemplateActionCondition } from './template-action-condition';
export abstract class AbstractTemplateAction extends AbstractMigrationAction {
  protected constructor(
    readonly conditions: ReadonlyArray<TemplateActionCondition>,
    readonly allowedPaths?: ReadonlyArray<string | RegExp>
  ) {
    super();
  }

  getRule(): Rule {
    return (tree: Tree, ctx: SchematicContext) => {
      setActiveProject(createProject(tree, '/'));
      const templatePaths = findTemplates(tree, findProjectPaths(tree));
      for (const path of templatePaths) {
        if (!this.isFileAllowed(path)) {
          continue;
        }
        const fileName = basename(path);
        const updatedTemplates: Array<string> = [];
        for (const fileContents of this.readTemplates(tree, path)) {
          // we need to copy the template string to a separate file so that the whole
          // migration logic based on the recorder is still working for inline templates
          const isolatedFilePath = join('/__cui-migration-tmp', fileName);
          tree.create(isolatedFilePath, fileContents);
          const recorder = tree.beginUpdate(isolatedFilePath);
          const { result, parents } = this.parseTemplate(fileContents);
          const elements = findElements(
            result.rootNodes,
            parents,
            this.conditions
          );
          for (const element of elements) {
            this.migrateElement(recorder, ctx, element, parents, fileContents);
          }
          tree.commitUpdate(recorder);
          updatedTemplates.push(tree.readText(isolatedFilePath));
          tree.delete(isolatedFilePath);
        }
        // we can then copy back the contents to the original locations when we are done
        this.applyTemplates(tree, path, updatedTemplates);
      }
    };
  }

  private isFileAllowed(pathToTest: string): boolean {
    if (!this.allowedPaths) {
      return true;
    }
    return this.allowedPaths.some((allowedPath) => {
      if (allowedPath instanceof RegExp) {
        return allowedPath.test(pathToTest);
      }
      return pathToTest.endsWith(allowedPath);
    });
  }

  protected abstract migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void;

  private readTemplates(tree: Tree, path: string): ReadonlyArray<string> {
    if (path.endsWith('.html')) {
      return [tree.readText(path)];
    } else if (path.endsWith('.component.ts')) {
      return getClasses(path)
        .map((cls) => getInlineTemplate(cls))
        .filter((res): res is string => !!res);
    } else {
      return [];
    }
  }

  private applyTemplates(
    tree: Tree,
    path: string,
    templates: ReadonlyArray<string>
  ): void {
    if (path.endsWith('.html') && templates.length === 1) {
      tree.overwrite(path, templates[0]);
    } else if (path.endsWith('.component.ts')) {
      const decls = getClasses(path);
      if (decls.length !== templates.length) {
        throw new Error(
          `Error when applying templates to component file. Found ${decls.length} components, but only ${templates.length} to apply.`
        );
      }
      const project = getActiveProject();
      if (!project) {
        throw new Error('Could not find typescript project to write templates');
      }
      decls.forEach((decl, index) =>
        writeInlineTemplate(decl, templates[index])
      );
      tree.overwrite(path, project.getSourceFileOrThrow(path).getText());
    }
  }

  private parseTemplate(templateString: string): {
    result: ParseTreeResult;
    parents: Map<Element, Element>;
  } {
    const parser = new HtmlParser();
    const result = parser.parse(templateString, '');
    const parents = this.constructParentMap(result);
    return { result, parents };
  }

  private constructParentMap(
    parseTreeResult: ParseTreeResult
  ): Map<Element, Element> {
    const res = new Map<Element, Element>();

    /*
     * There are actions which rely on getting all root-nodes of the document. Since a
     * ParseTreeResult has a field "rootNodes" (as opposed to "children" on regular Elements) I would
     * have needed to alter every single function signature to allow for
     * "Element | ParseTreeResult", and handle it. To save this work I introduce an artificial root
     * node which does not have a tag, attribute or anything else from relevance but populates
     * the children field with the rootNodes. In this way, when actions do
     * parents.get(<some-element-root>), they will get this artificial node which can be used to
     * get all root children of the template.
     */
    // TODO find a better solution instead of the artificial root node. But for now it works
    const artificialTemplateRootNodeSourceSpan = new ParseSourceSpan(
      new ParseLocation(new ParseSourceFile('', ''), 0, 0, 0),
      new ParseLocation(new ParseSourceFile('', ''), 0, 0, 0)
    );
    const artificialTemplateRootNode = {
      children: parseTreeResult.rootNodes,
      name: '',
      attrs: [],
      sourceSpan: artificialTemplateRootNodeSourceSpan,
      startSourceSpan: artificialTemplateRootNodeSourceSpan,
      endSourceSpan: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      visit: {} as any,
    } as Element;

    const setParentForChild = (child: Element, parent: Element | null) => {
      if (parent) {
        res.set(child, parent);
      }
      child.children
        .filter((c): c is Element => c instanceof Element)
        .forEach((c) => setParentForChild(c, child));
    };
    parseTreeResult.rootNodes
      .filter((rn: Node): rn is Element => rn instanceof Element)
      .forEach((rn) => {
        setParentForChild(rn, artificialTemplateRootNode);
      });
    return res;
  }
}
