import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-add-closing-tag', () => {
  const helper = new SchematicTestHelper();

  it('should add closing tag', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<lib-text-input/>`);
    await helper.runMigration('add-closing-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<lib-text-input></lib-text-input>`);
  });
  it('should ignore existing closing tag', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-text-input></lib-text-input>`
    );
    await helper.runMigration('add-closing-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<lib-text-input></lib-text-input>`);
  });
});
