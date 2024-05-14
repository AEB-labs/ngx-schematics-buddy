import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-add-pipe-to-attribute', () => {
  const helper = new SchematicTestHelper();

  it('should add pipe', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table [dataKey]="'name'"></lib-table>`
    );
    await helper.runMigration('add-pipe-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table [dataKey]="'name' | resolveFieldFn"></lib-table>`
    );
  });

  it('should add pipe to variable', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table [dataKey]="foo"></lib-table>`
    );
    await helper.runMigration('add-pipe-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table [dataKey]="foo | resolveFieldFn"></lib-table>`
    );
  });

  it('should add pipe and square brackets', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table dataKey="name"></lib-table>`
    );
    await helper.runMigration('add-pipe-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table [dataKey]="'name' | resolveFieldFn"></lib-table>`
    );
  });
});
