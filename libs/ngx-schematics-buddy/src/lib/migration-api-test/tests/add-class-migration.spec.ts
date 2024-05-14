import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-add-class', () => {
  const helper = new SchematicTestHelper();

  it('should add class', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div></div>`);
    await helper.runMigration('add-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="foo"></div>`);
  });

  it('should add class to existing attribute', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div class="bar"></div>`);
    await helper.runMigration('add-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="bar foo"></div>`);
  });

  it('should not add duplicate', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div class="foo"></div>`);
    await helper.runMigration('add-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="foo"></div>`);
  });
});
