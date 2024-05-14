import { SchematicTestHelper } from '../schematic-test-helper';

describe('test-template-position', () => {
  const helper = new SchematicTestHelper();

  it('it should apply migrations for separate templates', async () => {
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

  it('it should apply migrations for inline templates', async () => {
    // language=TS
    const inputTs = `@Component({
    selector: 'lib-my-component',
    template: \`
        <div class="before old after"></div>
        <div class="before old after"></div>
    \`
})
export class MyComponent {}`;
    // language=TS

    const expectedTs = `@Component({
    selector: 'lib-my-component',
    template: \`
        <div class="before new after"></div>
        <div class="before new after"></div>
    \`
})
export class MyComponent {}`;

    helper.writeFile('/dummy/dummy.component.ts', inputTs);
    await helper.runMigration('rename-class-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.ts'
    );

    expect(changedHtmlFile).toEqual(expectedTs);
  });
});
