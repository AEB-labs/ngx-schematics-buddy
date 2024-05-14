import { SchematicTestHelper } from '../schematic-test-helper';
import { migrationCommentText } from '../test-migrations/add-migration-comment-test-migration';

const commentText = `<!-- [Migration to v6]: ${migrationCommentText} -->`;

describe('test-add-migration-comment', () => {
  const helper = new SchematicTestHelper();

  it('should add the desired comment before targeted nodes', async () => {
    const old = `<lib-dropdown></lib-dropdown>
<lib-text-input></lib-text-input>
        `;
    const expected = `${commentText}
<lib-dropdown></lib-dropdown>
${commentText}
<lib-text-input></lib-text-input>
        `;
    helper.writeFile('/dummy/dummy.component.html', old);
    await helper.runMigration('add-migration-comment-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });

  it('should not add the desired comment before non-targeted nodes', async () => {
    const old = `<lib-chips-input></lib-chips-input>
<lib-text-input></lib-text-input>
        `;
    const expected = `<lib-chips-input></lib-chips-input>
${commentText}
<lib-text-input></lib-text-input>
        `;
    helper.writeFile('/dummy/dummy.component.html', old);
    await helper.runMigration('add-migration-comment-test-migration');

    const changedHtmlFile = helper.tree.readContent(
      '/dummy/dummy.component.html'
    );
    expect(changedHtmlFile).toEqual(expected);
  });
});
