import { chain } from '@angular-devkit/schematics';
import { AbstractMigrationAction } from './abstract-migration-action';

export function getRules(actions: ReadonlyArray<AbstractMigrationAction>) {
  return chain([...actions.map((action) => action.getRule())]);
}
