
export interface DatabaseResult<T = unknown> {
  rowsAffected?: number
  insertId?: number
  rows?: T[]
}


export interface DatabaseBatchQuery {
  query: string
  params?: unknown[] | unknown[][]
}

export interface DatabaseBatchResult {
  rowsAffected?: number
}


export abstract class DatabaseOperations {
  abstract execute<T = unknown>(
    query: string,
    params?: unknown[],
  ): DatabaseResult<T>

  abstract executeAsync<T = unknown>(
    query: string,
    params?: unknown[],
  ): Promise<DatabaseResult<T>>
}


export abstract class Transaction extends DatabaseOperations {
  abstract commit(): void
  abstract commitAsync(): Promise<void>

  abstract rollback(): void
  abstract rollbackAsync(): Promise<void>
}


export type TransactionCallback<R = unknown> = (
  transaction: Transaction,
) => Promise<R>


export abstract class Database extends DatabaseOperations {
  abstract isInitialized: boolean


  abstract initialize(): Promise<void>

  abstract close(): Promise<void>

  abstract transaction<R = unknown>(callback: TransactionCallback<R>): Promise<R>


  abstract executeBatch(
    queries: DatabaseBatchQuery[],
  ): DatabaseBatchResult

  abstract executeBatchAsync(
    queries: DatabaseBatchQuery[],
  ): Promise<DatabaseBatchResult>
}
