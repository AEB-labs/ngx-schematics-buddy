import { PackageJson } from 'nx/src/utils/package-json';
import { removeDependency } from './remove-dependency';

export function replaceDependency(
  packageJson: PackageJson,
  oldDepName: string,
  newDepName: string,
  newVersion: string,
  dependencyType: 'dependencies' | 'devDependencies' = 'dependencies'
): void {
  if (packageJson[dependencyType]?.[oldDepName]) {
    removeDependency(packageJson, oldDepName, dependencyType);
    const dependencies = packageJson[dependencyType] || {};
    dependencies[newDepName] = newVersion;
    packageJson[dependencyType] = dependencies;
  }
}
