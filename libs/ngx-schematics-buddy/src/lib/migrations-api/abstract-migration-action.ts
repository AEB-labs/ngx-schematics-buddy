import { Rule } from '@angular-devkit/schematics';

export abstract class AbstractMigrationAction {
  public abstract getRule(): Rule;
}
