import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-rename-pipe', () => {
  const helper = new SchematicTestHelper();

  it('should rename pipes in interpolated attributes', async () => {
    const contents = `
            <div [someInput]="'value1| |'| oldName: arg1: arg2"></div>
            <div someInput="'value1' | oldName"></div>
        `;

    const expected = `
            <div [someInput]="'value1| |'| newName: arg1: arg2"></div>
            <div someInput="'value1' | oldName"></div>
        `;

    helper.writeFile('/dummy/dummy.component.html', contents);
    await helper.runMigration('rename-pipe-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });

  it('should rename pipes in interpolated texts', async () => {
    const contents = `
            <div>
                Some normal text follow by an interpolation {{ someVariable| specialPipe }}
                {{ someVariable1 | anotherPipe }} {{
                    someVariable3 |specialPipe: arg1
                }}
            </div>
        `;

    const expected = `
            <div>
                Some normal text follow by an interpolation {{ someVariable| specialNewPipe }}
                {{ someVariable1 | anotherPipe }} {{
                    someVariable3 |specialNewPipe: arg1
                }}
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', contents);
    await helper.runMigration('rename-pipe-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });

  it('should rename chained pipes', async () => {
    const contents = `
            <div [someInput]="'value1' | oldName | specialPipe"></div>
            <div [someInput]="'value1' | oldName: arg1 | specialPipe: arg2">
                {{ 'someValue' | oldName |specialPipe}}
                {{ 'someValue' | oldName: arg1| specialPipe: arg2 }}
            </div>
        `;

    const expected = `
            <div [someInput]="'value1' | newName | specialNewPipe"></div>
            <div [someInput]="'value1' | newName: arg1 | specialNewPipe: arg2">
                {{ 'someValue' | newName |specialNewPipe}}
                {{ 'someValue' | newName: arg1| specialNewPipe: arg2 }}
            </div>
        `;

    helper.writeFile('/dummy/dummy.component.html', contents);
    await helper.runMigration('rename-pipe-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });
});
