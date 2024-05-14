import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-rename-element', () => {
  const helper = new SchematicTestHelper();

  it('rename element works', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<p-dropdown class="test"></p-dropdown>`
    );
    await helper.runMigration('rename-element-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-dropdown class="test"></lib-dropdown>`
    );
  });
});
