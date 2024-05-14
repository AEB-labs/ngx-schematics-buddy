import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-element-into-sibling-test-migration', () => {
  const helper = new SchematicTestHelper();

  it('should move element into sibling', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<span></span><div></div>`);
    await helper.runMigration('move-element-into-sibling-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div><span></span></div>`);
  });

  it('should not move the element when no suitable sibling is found', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<span></span><p></p>`);
    await helper.runMigration('move-element-into-sibling-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<span></span><p></p>`);
  });

  it('should move the element correctly while leaving other elements alone', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<span></span><div></div><p></p>`
    );
    await helper.runMigration('move-element-into-sibling-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div><span></span></div><p></p>`);
  });
});
