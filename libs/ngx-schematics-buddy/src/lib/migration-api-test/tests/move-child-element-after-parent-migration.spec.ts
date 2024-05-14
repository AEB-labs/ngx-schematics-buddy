import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-child-element-after-parent', () => {
  const helper = new SchematicTestHelper();

  it('should move child element after its parent element', async () => {
    //language=HTML
    const example = `
            <div class="paragraph">
                This is <span class="large">LARGE</span>, this is not
            </div>
        `;
    //language=HTML
    const expected = `
            <div class="paragraph">
                This is , this is not
            </div><span class="large">LARGE</span>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-child-element-after-parent-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });
});
