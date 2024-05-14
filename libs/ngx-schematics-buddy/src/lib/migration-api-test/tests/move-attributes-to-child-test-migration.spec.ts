import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-attributes-to-child', () => {
  const helper = new SchematicTestHelper();

  it('should move attributes', async () => {
    //language=HTML
    const example = `
            <div foo="test">
                <span></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div>
                <span foo="test"></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-child-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should only move matching attributes', async () => {
    //language=HTML
    const example = `
            <div foo="test" test="foo">
                <span></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div test="foo">
                <span foo="test"></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-child-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should work with multiple attributes', async () => {
    //language=HTML
    const example = `
            <div foo="test" bar="test">
                <span></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div>
                <span foo="test" bar="test"></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-child-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should work with square brackets', async () => {
    //language=HTML
    const example = `
            <div [foo]="test">
                <span></span>
            </div>
        `;
    //language=HTML
    const expected = `
            <div>
                <span [foo]="test"></span>
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-attributes-to-child-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });
});
