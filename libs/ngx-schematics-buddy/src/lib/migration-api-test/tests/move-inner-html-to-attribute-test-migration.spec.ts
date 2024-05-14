import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-inner-html-to-attribute', () => {
  const helper = new SchematicTestHelper();

  it('should move plain string', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-navigation-item attr="abc">text</lib-navigation-item>`
    );
    await helper.runMigration('move-inner-html-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-navigation-item attr="abc" label="text"></lib-navigation-item>`
    );
  });

  it('should move text with interpolation', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-navigation-item attr="abc">text: {{ value}}</lib-navigation-item>`
    );
    await helper.runMigration('move-inner-html-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-navigation-item attr="abc" label="text: {{ value}}"></lib-navigation-item>`
    );
  });

  it('should migrate simple interpolation to binding syntax', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-navigation-item attr="abc">{{ value}}</lib-navigation-item>`
    );
    await helper.runMigration('move-inner-html-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-navigation-item attr="abc" [label]="value"></lib-navigation-item>`
    );
  });

  it('should not migrate if there are elements', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-navigation-item attr="abc">text<br>other</lib-navigation-item>`
    );
    await helper.runMigration('move-inner-html-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-navigation-item attr="abc">text<br>other</lib-navigation-item>`
    );
  });

  it('should not migrate if the attribte already exists', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-navigation-item attr="abc" label="previous">text</lib-navigation-item>`
    );
    await helper.runMigration('move-inner-html-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-navigation-item attr="abc" label="previous">text</lib-navigation-item>`
    );
  });

  it('should not migrate if the content is empty', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<lib-navigation-item attr="abc">  </lib-navigation-item>`
    );
    await helper.runMigration('move-inner-html-to-attribute-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<lib-navigation-item attr="abc">  </lib-navigation-item>`
    );
  });
});
