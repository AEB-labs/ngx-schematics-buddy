import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-rename-attribute', () => {
  const helper = new SchematicTestHelper();

  it('should rename attribute', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div oldName="test"></div>`
    );
    await helper.runMigration('rename-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div newName="test"></div>`);
  });
  it('should rename input', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div [oldName]="'test'">`);
    await helper.runMigration('rename-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div [newName]="'test'">`);
  });
});
