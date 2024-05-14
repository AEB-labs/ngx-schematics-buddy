import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-negate-attribute', () => {
  const helper = new SchematicTestHelper();

  it('should negate true', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table [pagination]="true"></lib-table>`
    );
    await helper.runMigration('negate-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table [pagination]="false"></lib-table>`
    );
  });

  it('should negate false', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table [pagination]="false"></lib-table>`
    );
    await helper.runMigration('negate-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table [pagination]="true"></lib-table>`
    );
  });

  it('should negate expression', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-table [pagination]="foo"></lib-table>`
    );
    await helper.runMigration('negate-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-table [pagination]="!foo"></lib-table>`
    );
  });
});
