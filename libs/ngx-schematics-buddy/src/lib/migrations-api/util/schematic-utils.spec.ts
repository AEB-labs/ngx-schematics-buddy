import { getSystemPath, normalize, virtualFs } from '@angular-devkit/core';
import { TempScopedNodeJsSyncHost } from '@angular-devkit/core/node/testing';
import { HostTree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as shell from 'shelljs';
import { findProjectPaths } from './schematic-utils';

const angularJson = {
  $schema: './node_modules/@angular/cli/lib/config/schema.json',
  version: 1,
  newProjectRoot: 'projects',
  projects: {
    client: {
      root: '',
      sourceRoot: 'src',
      projectType: 'application',
      prefix: 'app',
      architect: {},
    },
    'client-e2e': {
      sourceRoot: 'e2e/src',
      projectType: 'application',
      architect: {},
    },
  },
  defaultProject: 'client',
};

function writeFile(
  host: TempScopedNodeJsSyncHost,
  filePath: string,
  contents: string
) {
  host.sync.write(normalize(filePath), virtualFs.stringToFileBuffer(contents));
}

describe('Schematic Utils', () => {
  let host: TempScopedNodeJsSyncHost;
  let tree: UnitTestTree;

  let tmpDirPath: string;
  let previousWorkingDir: string;

  beforeEach(() => {
    host = new TempScopedNodeJsSyncHost();
    tree = new UnitTestTree(new HostTree(host));

    previousWorkingDir = shell.pwd();
    tmpDirPath = getSystemPath(host.root);

    writeFile(host, '/angular.json', JSON.stringify(angularJson));

    // Switch into the temporary directory path. This allows us to run
    // the schematic against our custom unit test tree.
    shell.cd(tmpDirPath);
  });

  afterEach(() => {
    shell.cd(previousWorkingDir);
    shell.rm('-r', tmpDirPath);
  });

  it('should return correct project paths', async () => {
    const paths = findProjectPaths(tree);
    expect(paths).toEqual(['/src', '/e2e/src']);
  });
});
