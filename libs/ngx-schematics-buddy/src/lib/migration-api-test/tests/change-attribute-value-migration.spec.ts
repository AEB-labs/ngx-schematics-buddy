import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-change-attribute-value', () => {
  const helper = new SchematicTestHelper();

  it('should change value and add brackets', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<my-elem attr="contents"></my-elem>`
    );
    await helper.runMigration('change-attribute-value-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<my-elem [attr]="prefix contents suffix"></my-elem>`
    );
  });

  it('should change value and remove brackets', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<my-elem [attr]="contents"></my-elem>`
    );
    await helper.runMigration('change-attribute-value-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<my-elem attr="prefix contents suffix"></my-elem>`
    );
  });
});
