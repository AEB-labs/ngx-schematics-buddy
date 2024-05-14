import { PackageJson } from 'nx/src/utils/package-json';

export function removeDependency(
  packageJson: PackageJson,
  depName: string,
  dependencyType: 'dependencies' | 'devDependencies' = 'dependencies'
): void {
  if (packageJson[dependencyType]?.[depName]) {
    delete packageJson[dependencyType]?.[depName];
  }
}
