import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-surround-inner-html', () => {
  const helper = new SchematicTestHelper();

  it('should surround inner-html', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table><lib-column></lib-column></lib-table>`
    );
    await helper.runMigration('surround-inner-html-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table><lib-columns><lib-column></lib-column></lib-columns></lib-table>`
    );
  });
});
