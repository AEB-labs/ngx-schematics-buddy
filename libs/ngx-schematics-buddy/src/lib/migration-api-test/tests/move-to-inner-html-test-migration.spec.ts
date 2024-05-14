import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-to-inner-html', () => {
  const helper = new SchematicTestHelper();

  it('should move to inner html', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-dropdown nxLabel="test"></lib-dropdown>`
    );
    await helper.runMigration('move-to-inner-html-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-dropdown>
<lib-field-label>test</lib-field-label></lib-dropdown>`
    );
  });
  it('should move input to inner html', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-dropdown [nxLabel]="'prefix' + someProp"></lib-dropdown>`
    );
    await helper.runMigration('move-to-inner-html-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-dropdown>
<lib-field-label>{{'prefix' + someProp}}</lib-field-label></lib-dropdown>`
    );
  });
  it('should put inputs with string literals in simple text nodes', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-dropdown [nxLabel]="'test'"></lib-dropdown>`
    );
    await helper.runMigration('move-to-inner-html-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-dropdown>
<lib-field-label>test</lib-field-label></lib-dropdown>`
    );
  });
  it('should move to inner html without wrapping tag', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div content="test"></div>`
    );
    await helper.runMigration('move-to-inner-html-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div>test</div>`);
  });
});
