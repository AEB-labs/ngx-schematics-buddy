import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-rename-class', () => {
  const helper = new SchematicTestHelper();

  it('should rename class', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div class="before old after"></div>`
    );
    await helper.runMigration('rename-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="before new after"></div>`);
  });

  it('should not add if old does not exist', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div class="some other"></div>`
    );
    await helper.runMigration('rename-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="some other"></div>`);
  });

  it('should remove if new one already exists', async () => {
    helper.writeFile(
      '/dummy/dummy.component.html',
      `<div class="before old middle new end"></div>`
    );
    await helper.runMigration('rename-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(
      `<div class="before middle new end"></div>`
    );
  });

  it('should not add the class attribute to elements that do not have a class', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div id="test"></div>`);
    await helper.runMigration('rename-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div id="test"></div>`);
  });
});
