import type {
  BatchQueryCommand,
  BatchQueryResult,
  QueryResult,
  QueryResultRow,
  SQLiteQueryParams,
} from 'react-native-nitro-sqlite'

import type {
  DatabaseBatchQuery,
  DatabaseBatchResult,
  DatabaseResult,
} from '../database'


export class NitroSqliteDatabaseUtils {
  static buildDatabaseResultFromQueryResult<T>(
    queryResult: QueryResult,
  ): DatabaseResult<T> {
    const rowsAffected = queryResult.rowsAffected
    const insertId = queryResult.insertId
    const rows = this.mapRowsFromQueryResult(queryResult.rows) as T[] | undefined

    return { rowsAffected, insertId, rows }
  }

  private static mapRowsFromQueryResult(
    rows: QueryResult['rows'],
  ): Record<string, unknown>[] | undefined {
    return rows?._array.map(item => {
      return this.mapRowItemFromQueryResult(item)
    })
  }

  private static mapRowItemFromQueryResult(
    item: QueryResultRow,
  ): Record<string, unknown> {
    const newItem: Record<string, unknown> = {}

    const keys = Object.keys(item)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = item[key]


      const isNitroSqliteNull = this.isNitroSqliteNullItem(value)
      if (isNitroSqliteNull) {
        newItem[key] = null
        continue
      }


      newItem[key] = value
    }

    return newItem
  }

  private static isNitroSqliteNullItem(value: unknown): boolean {
    const isObject = typeof value === 'object'
    if (!isObject) return false

    if (value === null) return false

    const keys = Object.keys(value)
    if (keys.length !== 1) return false

    const nitroSqliteNullKey = 'isNitroSQLiteNull'

    const isNitroSqliteNullKey = nitroSqliteNullKey in value
    if (!isNitroSqliteNullKey) return false

    const isNitroSqliteNullValue = value[nitroSqliteNullKey] === true
    if (!isNitroSqliteNullValue) return false

    return true
  }


  static mapDatabaseBatchQueryToBatchQueryCommand(
    queries: DatabaseBatchQuery[],
  ): BatchQueryCommand[] {
    return queries.map<BatchQueryCommand>(query => ({
      query: query.query,
      params: query.params as SQLiteQueryParams | SQLiteQueryParams[] | undefined,
    }))
  }

  static buildDatabaseBatchResultFromBatchQueryResult(
    batchQueryResult: BatchQueryResult,
  ): DatabaseBatchResult {
    return {
      rowsAffected: batchQueryResult.rowsAffected,
    }
  }
}
