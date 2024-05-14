import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-remove-element-tag', () => {
  const helper = new SchematicTestHelper();

  it('should remove the tag', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<span></span>`);
    await helper.runMigration('remove-element-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(``);
  });

  it('should keep the descendants intact', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<span><p>Some descendant</p></span>`
    );
    await helper.runMigration('remove-element-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<p>Some descendant</p>`);
  });
});
