import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-copy-attribute', () => {
  const helper = new SchematicTestHelper();

  it('should copy attribute', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div oldName="test"></div>`
    );
    await helper.runMigration('copy-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<div oldName="test" newName="test"></div>`
    );
  });
  it('should copy attribute with square-brackets', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div [oldName]="'test'">`);
    await helper.runMigration('copy-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<div [oldName]="'test'" [newName]="'test'">`
    );
  });
});
