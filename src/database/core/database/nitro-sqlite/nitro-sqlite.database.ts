import type {
  NitroSQLiteConnection,
  NitroSQLiteConnectionOptions,
  SQLiteQueryParamItem,
  Transaction as SQLiteTransaction,
} from 'react-native-nitro-sqlite'
import { open } from 'react-native-nitro-sqlite'

import { stringifyError } from '@utils'
import {
  DatabaseAlreadyInitializedError,
  DatabaseConnectionError,
  DatabaseNotInitializedError,
  DatabaseQueryExecutionError,
  OperationNotImplementedError,
} from '../../errors'
import type {
  DatabaseBatchQuery,
  DatabaseBatchResult,
  DatabaseResult,
  Transaction,
  TransactionCallback,
} from '../database'
import { Database } from '../database'
import { NitroSqliteTransaction } from './nitro-sqlite.transaction'
import { NitroSqliteDatabaseUtils } from './nitro-sqlite.utils'


export class NitroSqliteDatabase extends Database {


  protected static readonly DEFAULT_DATABASE_NAME = 'database.sqlite'
  protected static readonly DEFAULT_DATABASE_LOCATION = 'default'


  private readonly databaseName: string
  private readonly databaseLocation: string

  private database: NitroSQLiteConnection | null = null


  constructor(databaseName?: string, location?: string) {
    super()

    this.databaseName = databaseName ?? NitroSqliteDatabase.DEFAULT_DATABASE_NAME
    this.databaseLocation = location ?? NitroSqliteDatabase.DEFAULT_DATABASE_LOCATION
  }


  override get isInitialized() {
    return this.database !== null
  }


  // eslint-disable-next-line @typescript-eslint/require-await
  override async initialize(): Promise<void> {
    if (this.database) {
      throw new DatabaseAlreadyInitializedError(
        `${NitroSqliteDatabase.name} "${this.databaseName}" is already initialized`,
      )
    }

    const options: NitroSQLiteConnectionOptions = {
      name: this.databaseName,
      location: this.databaseLocation,
    }

    try {
      this.database = open(options)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseConnectionError(
        `Failed to initialize ${NitroSqliteDatabase.name} "${this.databaseName}": ${errorMessage}`,
      )
    }
  }


  // eslint-disable-next-line @typescript-eslint/require-await
  override async close(): Promise<void> {
    if (!this.database) {
      throw new DatabaseNotInitializedError(
        `${NitroSqliteDatabase.name} "${this.databaseName}" is not initialized`,
      )
    }

    try {
      this.database.close()
      this.database = null
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseConnectionError(
        `Failed to close ${NitroSqliteDatabase.name} "${this.databaseName}": ${errorMessage}`,
      )
    }
  }


  override async transaction<R = unknown>(
    callback: TransactionCallback<R>,
  ): Promise<R> {
    if (!this.database) {
      throw new DatabaseNotInitializedError(
        `${NitroSqliteDatabase.name} "${this.databaseName}" is not initialized`,
      )
    }

    return await this.database.transaction(async tx => {
      const nitroSqliteTransaction = this.buildNitroSqliteTransaction(tx)
      return await callback(nitroSqliteTransaction)
    })
  }

  private buildNitroSqliteTransaction(tx: SQLiteTransaction): Transaction {
    return new NitroSqliteTransaction(tx, this.databaseName)
  }


  override execute<T = unknown>(
    query: string,
    params?: unknown[],
  ): DatabaseResult<T> {
    if (!this.database) {
      throw new DatabaseNotInitializedError(
        `${NitroSqliteDatabase.name} "${this.databaseName}" is not initialized`,
      )
    }

    try {
      const result = this.database.execute(
        query,
        params as SQLiteQueryParamItem[] | undefined,
      )

      return NitroSqliteDatabaseUtils.buildDatabaseResultFromQueryResult<T>(result)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseQueryExecutionError(
        `${NitroSqliteDatabase.name} query execution failed in "${this.databaseName}": ${errorMessage}`,
      )
    }
  }

  override async executeAsync<T = unknown>(
    query: string,
    params?: unknown[],
  ): Promise<DatabaseResult<T>> {
    if (!this.database) {
      throw new DatabaseNotInitializedError(
        `${NitroSqliteDatabase.name} "${this.databaseName}" is not initialized`,
      )
    }

    try {
      const result = await this.database.executeAsync(
        query,
        params as SQLiteQueryParamItem[] | undefined,
      )

      return NitroSqliteDatabaseUtils.buildDatabaseResultFromQueryResult<T>(result)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseQueryExecutionError(
        `${NitroSqliteDatabase.name} query execution failed in "${this.databaseName}": ${errorMessage}`,
      )
    }
  }


  override executeBatch(
    queries: DatabaseBatchQuery[],
  ): DatabaseBatchResult {
    if (!this.database) {
      throw new DatabaseNotInitializedError(
        `${NitroSqliteDatabase.name} "${this.databaseName}" is not initialized`,
      )
    }

    try {
      const command = NitroSqliteDatabaseUtils.mapDatabaseBatchQueryToBatchQueryCommand(
        queries,
      )

      const result = this.database.executeBatch(command)

      return NitroSqliteDatabaseUtils.buildDatabaseBatchResultFromBatchQueryResult(result)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseQueryExecutionError(
        `${NitroSqliteDatabase.name} query execution failed in "${this.databaseName}": ${errorMessage}`,
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async executeBatchAsync(
    queries: DatabaseBatchQuery[],
  ): Promise<DatabaseBatchResult> {
    throw new OperationNotImplementedError(
      `${NitroSqliteDatabase.name} executeBatchAsync method is not implemented`,
    )
  }
}
