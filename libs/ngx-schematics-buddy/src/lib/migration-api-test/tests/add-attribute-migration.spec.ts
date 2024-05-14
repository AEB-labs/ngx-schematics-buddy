import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-add-attribute', () => {
  const helper = new SchematicTestHelper();

  it('should add attribute', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div></div>`);
    await helper.runMigration('add-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="row"></div>`);
  });
  it('should add input', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<input/>`);
    await helper.runMigration('add-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<input [value]="'aString'"/>`);
  });
  it('should work with self closing tags', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<input/>`);
    await helper.runMigration('add-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<input [value]="'aString'"/>`);
  });
  it('should not add the attribute if it already exists', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<input value=""/>`);
    await helper.runMigration('add-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<input value=""/>`);
  });
});
