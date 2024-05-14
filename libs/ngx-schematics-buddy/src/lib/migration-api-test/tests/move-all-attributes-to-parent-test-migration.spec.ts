import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-move-all-attributes-to-parent', () => {
  const helper = new SchematicTestHelper();

  it('should move attributes', async () => {
    //language=HTML
    const example = `
            <lib-table-section>
                <lib-table-commands></lib-table-commands>
                <lib-table [data]="data">
                    <lib-column></lib-column>
                </lib-table>
            </lib-table-section>
        `;
    //language=HTML
    const expected = `
            <lib-table-section [data]="data">
                <lib-table-commands></lib-table-commands>
                <lib-table>
                    <lib-column></lib-column>
                </lib-table>
            </lib-table-section>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-all-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should not break without attributes', async () => {
    //language=HTML
    const example = `
            <lib-table-section>
                <lib-table-commands></lib-table-commands>
                <lib-table>
                    <lib-column></lib-column>
                </lib-table>
            </lib-table-section>
        `;
    //language=HTML
    const expected = `
            <lib-table-section>
                <lib-table-commands></lib-table-commands>
                <lib-table>
                    <lib-column></lib-column>
                </lib-table>
            </lib-table-section>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-all-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });

  it('should not break without child', async () => {
    //language=HTML
    const example = `
            <lib-table-section>
                <lib-table-commands></lib-table-commands>
            </lib-table-section>
        `;
    //language=HTML
    const expected = `
            <lib-table-section>
                <lib-table-commands></lib-table-commands>
            </lib-table-section>
        `;

    helper.writeFile('/dummy/dummy.component.html', example);
    await helper.runMigration('move-all-attributes-to-parent-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );

    expect(changedHtmlFile).toEqual(expected);
  });
});
