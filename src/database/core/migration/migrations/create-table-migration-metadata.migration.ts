import type { Transaction } from '../../database'
import { Migration } from '../migration'


export class CreateTableMigrationMetadataMigration extends Migration {
  override async up(transaction: Transaction): Promise<void> {
    await transaction.executeAsync(`
      CREATE TABLE IF NOT EXISTS migration_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  override async down(transaction: Transaction): Promise<void> {
    await transaction.executeAsync(`
      DROP TABLE IF EXISTS migration_metadata;
    `)
  }
}
