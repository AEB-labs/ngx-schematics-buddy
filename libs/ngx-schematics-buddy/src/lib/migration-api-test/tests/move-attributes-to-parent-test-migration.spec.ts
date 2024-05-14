import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-attributes-to-parent', () => {
  const helper = new SchematicTestHelper();

  it('should move attributes', async () => {
    //language=HTML
    const example = `
            <div>
                <span foo="test"></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div foo="test">
                <span></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should only move matching attributes', async () => {
    //language=HTML
    const example = `
            <div>
                <span foo="test" test="foo"></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div foo="test">
                <span test="foo"></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should work with multiple attributes', async () => {
    //language=HTML
    const example = `
            <div>
                <span foo="test" bar="test"></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div foo="test" bar="test">
                <span></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should work with square brackets', async () => {
    //language=HTML
    const example = `
            <div>
                <span [foo]="test"></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div [foo]="test">
                <span></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });
});
