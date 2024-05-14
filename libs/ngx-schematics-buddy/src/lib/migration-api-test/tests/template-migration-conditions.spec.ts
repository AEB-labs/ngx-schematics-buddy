import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-conditions', () => {
  const helper = new SchematicTestHelper();

  it('isNamed only finds correct elements', async () => {
    helper.writeFile('/dummy/dummy.component.html', `<div></div><p></p>`);
    await helper.runMigration('template-migration-conditions-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(`<div class="test"></div><p></p>`);
  });

  it('hasAttributeValue only finds correct elements', async () => {
    // language=HTML
    const inputHtml = `
            <input value="test">
            <input [value]="'test'">
            <input value="nichttest">
            <input [value]="'nichttest'">
            <input [value]="test">
            <input [count]="15">
            <input count="15">
            <input [isFalse]="false">
            <input [isFalse]="null">
            <input [isFalse]="undefined">
            <input [count]="null">
            <input [count]="undefined">
            <input>
        `;
    // language=HTML

    const expectedHtml = `
            <input value="test" class="test">
            <input [value]="'test'" class="test">
            <input value="nichttest">
            <input [value]="'nichttest'">
            <input [value]="test">
            <input quantity="fifteen">
            <input quantity="fifteen">
            <input [isTrue]="true">
            <input [isFalse]="null">
            <input [isFalse]="undefined">
            <input [count]="null">
            <input [count]="undefined">
            <input>
        `;

    helper.writeFile('/dummy/dummy.component.html', inputHtml);
    await helper.runMigration('template-migration-conditions-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expectedHtml);
  });

  it('hasParentWith only finds correct elements', async () => {
    // language=HTML
    const inputHtml = `
            <lib-dropdown>
                <lib-field-label></lib-field-label>
            </lib-dropdown>
        `;
    // language=HTML

    const expectedHtml = `
            <lib-dropdown>
                <lib-field-label class="test"></lib-field-label>
            </lib-dropdown>
        `;

    helper.writeFile('/dummy/dummy.component.html', inputHtml);
    await helper.runMigration('template-migration-conditions-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expectedHtml);
  });

  it('hasChildWith only finds correct elements', async () => {
    // language=HTML
    const inputHtml = `
            <lib-text-input>
                <lib-field-label></lib-field-label>
            </lib-text-input>
            <lib-text-input></lib-text-input>
        `;
    // language=HTML

    const expectedHtml = `
            <lib-text-input class="test">
                <lib-field-label></lib-field-label>
            </lib-text-input>
            <lib-text-input></lib-text-input>
        `;

    helper.writeFile('/dummy/dummy.component.html', inputHtml);
    await helper.runMigration('template-migration-conditions-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expectedHtml);
  });
});
