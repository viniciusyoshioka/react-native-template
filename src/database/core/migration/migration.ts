import type { Transaction } from '../database'


// TODO: Pass another type of param to not force to write manual SQL.
// Something like QueryBuilder, but for migration
export abstract class Migration {
  abstract up(transaction: Transaction): Promise<void>
  abstract down(transaction: Transaction): Promise<void>
}


export type MigrationClass = new () => Migration
