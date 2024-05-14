import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-replace-strings', () => {
  const helper = new SchematicTestHelper();

  it('should replace text', async () => {
    helper.writeFile('/dummy/test.scss', `something $abc else`);
    await helper.runMigration('replace-strings-test-migration');

    const changedHtmlFile = helper.tree.readContent('/dummy/test.scss');
    expect(changedHtmlFile).toEqual(`something $def else`);
  });
});
