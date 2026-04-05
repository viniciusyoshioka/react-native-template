import type {
  SQLiteQueryParams,
  Transaction as SQLiteTransaction,
} from 'react-native-nitro-sqlite'

import { stringifyError } from '@utils'
import { DatabaseQueryExecutionError, OperationNotImplementedError } from '../../errors'
import type { DatabaseResult } from '../database'
import { Transaction } from '../database'
import { NitroSqliteDatabaseUtils } from './nitro-sqlite.utils'


export class NitroSqliteTransaction extends Transaction {


  private readonly tx: SQLiteTransaction
  private readonly databaseName: string


  constructor(tx: SQLiteTransaction, databaseName: string) {
    super()

    this.tx = tx
    this.databaseName = databaseName
  }


  override commit(): void {
    this.tx.commit()
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async commitAsync(): Promise<void> {
    throw new OperationNotImplementedError(
      `${NitroSqliteTransaction.name} commitAsync method is not implemented`,
    )
  }


  override rollback(): void {
    this.tx.rollback()
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async rollbackAsync(): Promise<void> {
    throw new OperationNotImplementedError(
      `${NitroSqliteTransaction.name} rollbackAsync method is not implemented`,
    )
  }


  override execute<T = unknown>(
    query: string,
    params?: unknown[],
  ): DatabaseResult<T> {
    try {
      const result = this.tx.execute(
        query,
        params as SQLiteQueryParams | undefined,
      )

      return NitroSqliteDatabaseUtils.buildDatabaseResultFromQueryResult<T>(result)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseQueryExecutionError(
        `${NitroSqliteTransaction.name} query execution failed in "${this.databaseName}": ${errorMessage}`,
      )
    }
  }

  override async executeAsync<T = unknown>(
    query: string,
    params?: unknown[],
  ): Promise<DatabaseResult<T>> {
    try {
      const result = await this.tx.executeAsync(
        query,
        params as SQLiteQueryParams | undefined,
      )

      return NitroSqliteDatabaseUtils.buildDatabaseResultFromQueryResult<T>(result)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new DatabaseQueryExecutionError(
        `${NitroSqliteTransaction.name} query execution failed in "${this.databaseName}": ${errorMessage}`,
      )
    }
  }
}
