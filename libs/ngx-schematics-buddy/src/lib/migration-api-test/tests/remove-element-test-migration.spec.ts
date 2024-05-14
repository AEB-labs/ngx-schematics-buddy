import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-remove-element', () => {
  const helper = new SchematicTestHelper();

  it('should remove attribute and input', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div attr1="test" [attr2]="'test'"><span></span></div>`
    );
    await helper.runMigration('remove-element-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<div attr1="test" [attr2]="'test'"></div>`
    );
  });
});
