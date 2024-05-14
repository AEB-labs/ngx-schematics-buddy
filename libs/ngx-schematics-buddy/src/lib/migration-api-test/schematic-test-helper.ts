import { getSystemPath, normalize, virtualFs } from '@angular-devkit/core';
import { TempScopedNodeJsSyncHost } from '@angular-devkit/core/node/testing';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as shell from 'shelljs';

export class SchematicTestHelper {
  runner!: SchematicTestRunner;
  host!: TempScopedNodeJsSyncHost;
  tree!: UnitTestTree;

  tmpDirPath!: string;
  previousWorkingDir!: string;

  constructor(
    readonly migrationCollectionPath = require.resolve(
      './test-migrations/migration-api-test-collection.json'
    )
  ) {
    // TODO refactor
    // @ts-ignore
    beforeEach(() => {
      this.beforeEach();
    });

    // TODO refactor
    // @ts-ignore
    afterEach(() => {
      this.afterEach();
    });
  }

  beforeEach() {
    this.runner = new SchematicTestRunner(
      'testCollection',
      this.migrationCollectionPath
    );
    this.host = new TempScopedNodeJsSyncHost();
    this.tree = new UnitTestTree(new HostTree(this.host));

    this.previousWorkingDir = shell.pwd();
    this.tmpDirPath = getSystemPath(this.host.root);

    // Switch into the temporary directory path. This allows us to run
    // the schematic against our custom unit test tree.
    shell.cd(this.tmpDirPath);
  }

  afterEach() {
    shell.cd(this.previousWorkingDir);
    shell.rm('-r', this.tmpDirPath);
  }

  writeFile(filePath: string, contents: string) {
    this.host.sync.write(
      normalize(filePath),
      virtualFs.stringToFileBuffer(contents)
    );
  }

  async runMigration(schematicName: string) {
    return this.runner.runSchematic(schematicName, {}, this.tree);
  }
}
