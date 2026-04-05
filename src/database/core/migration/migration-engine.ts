import { stringifyError } from '@utils'
import type { Database } from '../database'
import { MigrationApplicationError, MigrationNotFoundError } from '../errors'
import type { MigrationClass } from './migration'
import { CreateTableMigrationMetadataMigration } from './migrations/create-table-migration-metadata.migration'


export class MigrationEngine {


  private readonly database: Database
  private readonly migrations: MigrationClass[]


  constructor(database: Database, migrations: MigrationClass[]) {
    this.database = database
    this.migrations = migrations
  }


  private getMigrationName(migration: MigrationClass): string {
    return (migration.prototype as FunctionConstructor).constructor.name
  }

  private async getAppliedMigrationNames(): Promise<string[]> {
    const appliedMigrations = await this.database.executeAsync<{ name: string }>(`
      SELECT name
      FROM migration_metadata
      ORDER BY applied_at DESC;
    `)

    const rows = appliedMigrations.rows ?? []
    return rows.map(row => row.name)
  }


  async runMigrationsUp(): Promise<void> {
    await this.configureDatabaseForMigration()

    const appliedMigrationNames = await this.getAppliedMigrationNames()
    const appliedMigrationNamesSet = new Set(appliedMigrationNames)

    for (let i = 0; i < this.migrations.length; i++) {
      const migration = this.migrations[i]
      const migrationName = this.getMigrationName(migration)

      const skipMigration = appliedMigrationNamesSet.has(migrationName)
      if (skipMigration) continue

      try {
        await this.applyMigrationUp(migration)
      } catch (error) {
        const errorMessage = stringifyError(error)
        throw new MigrationApplicationError(
          `Failed to apply migration "${migrationName}": ${errorMessage}`,
        )
      }
    }
  }

  private async configureDatabaseForMigration(): Promise<void> {
    await this.database.transaction(async transaction => {
      const migrationMetadataMigration = new CreateTableMigrationMetadataMigration()
      await migrationMetadataMigration.up(transaction)
    })
  }

  private async applyMigrationUp(migration: MigrationClass): Promise<void> {
    await this.database.transaction(async transaction => {
      const migrationName = this.getMigrationName(migration)

      const migrationInstance = new migration()
      await migrationInstance.up(transaction)

      await transaction.executeAsync(
        'INSERT INTO migration_metadata (name) VALUES (?);',
        [migrationName],
      )
    })
  }


  async runMigrationsDown(): Promise<void> {
    const appliedMigrationNames = await this.getAppliedMigrationNames()
    const reversedAppliedMigrationNames = appliedMigrationNames.reverse()

    for (let i = 0; i < reversedAppliedMigrationNames.length; i++) {
      const migrationName = reversedAppliedMigrationNames[i]
      const migration = this.getMigrationWithName(migrationName)

      if (!migration) {
        throw new MigrationNotFoundError(`Migration "${migrationName}" not found`)
      }

      try {
        await this.applyMigrationDown(migration)
      } catch (error) {
        const errorMessage = stringifyError(error)
        throw new MigrationApplicationError(
          `Failed to apply migration "${migrationName}": ${errorMessage}`,
        )
      }
    }
  }

  private getMigrationWithName(migrationName: string): MigrationClass | undefined {
    return this.migrations.find(migration => {
      const currentMigrationName = this.getMigrationName(migration)
      return currentMigrationName === migrationName
    })
  }

  private async applyMigrationDown(migration: MigrationClass): Promise<void> {
    await this.database.transaction(async transaction => {
      const migrationName = this.getMigrationName(migration)

      const migrationInstance = new migration()
      await migrationInstance.down(transaction)

      await transaction.executeAsync(
        'DELETE FROM migration_metadata WHERE name = ?;',
        [migrationName],
      )
    })
  }
}
