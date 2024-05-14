import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-wrap-all-direct-children-in-tag', () => {
  const helper = new SchematicTestHelper();

  it('should wrap targeted children correctly', async () => {
    const old = `<lib-test-parent>
<lib-test-child-1></lib-test-child-1>
<lib-test-child-2></lib-test-child-2>
</lib-test-parent>`;

    const expected = `<lib-test-parent>


<lib-test-wrapper>
<lib-test-child-1></lib-test-child-1>
<lib-test-child-2></lib-test-child-2>
</lib-test-wrapper>
</lib-test-parent>`;

    helper.writeFile('/dummy/dummy.component.html', old);
    await helper.runMigration('wrap-all-direct-children-in-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });

  it('should leave other elements and children alone', async () => {
    const old = `<lib-test-other-parent></lib-test-other-parent>
<lib-test-parent>
<lib-test-child-1></lib-test-child-1>
<lib-test-child-2></lib-test-child-2>
<lib-test-child-3></lib-test-child-3>
</lib-test-parent>`;

    const expected = `<lib-test-other-parent></lib-test-other-parent>
<lib-test-parent>


<lib-test-child-3></lib-test-child-3>
<lib-test-wrapper>
<lib-test-child-1></lib-test-child-1>
<lib-test-child-2></lib-test-child-2>
</lib-test-wrapper>
</lib-test-parent>`;

    helper.writeFile('/dummy/dummy.component.html', old);
    await helper.runMigration('wrap-all-direct-children-in-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });

  it('should use a pre-existing tag if configured for it', async () => {
    const old = `<lib-test-other-parent></lib-test-other-parent>
<lib-test-parent>
<lib-test-child-1></lib-test-child-1>
<lib-test-child-2></lib-test-child-2>
<lib-test-child-3></lib-test-child-3>
<lib-test-wrapper></lib-test-wrapper>
</lib-test-parent>`;

    const expected = `<lib-test-other-parent></lib-test-other-parent>
<lib-test-parent>


<lib-test-child-3></lib-test-child-3>
<lib-test-wrapper>
<lib-test-child-1></lib-test-child-1>
<lib-test-child-2></lib-test-child-2>
</lib-test-wrapper>
</lib-test-parent>`;

    helper.writeFile('/dummy/dummy.component.html', old);
    await helper.runMigration('wrap-all-direct-children-in-tag-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });
});
