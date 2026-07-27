import type {
  DatabaseParams,
  QueryData,
  QueryWithParams,
} from '../types'
import { QueryParser } from './query-parser'


// TODO: Get entity table and column names from decorators. Then, replace
// table and column names based on that metadata.
// TODO: Throw custom error
export class SqliteQueryParser extends QueryParser {


  build(queryData: QueryData): QueryWithParams {
    const queryStatements: string[] = []
    const queryParams: unknown[] = []


    const builtQueryParts = [
      this.buildSelect(queryData),
      this.buildFrom(queryData),
      this.buildWhere(queryData),
      this.buildGroupBy(queryData),
      this.buildOrderBy(queryData),
      this.buildLimit(queryData),
      this.buildOffset(queryData),
    ]


    for (const builtQueryPart of builtQueryParts) {
      if (builtQueryPart === undefined) {
        continue
      }

      const [statement, params] = builtQueryPart

      queryStatements.push(statement)

      if (params !== undefined) {
        queryParams.push(...params)
      }
    }


    const query = queryStatements.join(' ').concat(';')
    const params = queryParams.length
      ? queryParams
      : undefined

    return { query, params }
  }


  // TODO: Convert table and column case, keep column alias case
  private buildSelect(
    queryData: Pick<QueryData, 'select'>,
  ): [string, DatabaseParams] {
    const selectColumns = queryData.select.join(', ')

    const selectStatement = `SELECT ${selectColumns}`

    return [
      selectStatement,
      undefined,
    ]
  }


  // TODO: Convert table case, keep table alias case
  private buildFrom(
    queryData: Pick<QueryData, 'from' | 'fromAlias'>,
  ): [string, DatabaseParams] {
    if (queryData.from === null) {
      throw new Error('Null is an invalid value for "from" statement')
    }

    const fromQueryData = queryData.from
    const fromStatement = `FROM ${fromQueryData}`

    if (queryData.fromAlias === undefined) {
      return [
        fromStatement,
        undefined,
      ]
    }

    const fromAliasQueryData = queryData.fromAlias
    const fromAliasStatement = `AS ${fromAliasQueryData}`
    const fromStatementWithAlias = `${fromStatement} ${fromAliasStatement}`

    return [
      fromStatementWithAlias,
      undefined,
    ]
  }


  // TODO: Convert table and column case, keep column alias case
  private buildWhere(
    queryData: Pick<QueryData, 'where'>,
  ): [string, DatabaseParams] | undefined {
    if (!queryData.where?.length) {
      return undefined
    }

    const whereClauses: [string, DatabaseParams][] = queryData.where
      .map((whereClause, index) => {
        const { condition, params } = whereClause
        const clause = whereClause.clause.trim()

        const whereClauseWithPlaceholder = index === 0
          ? clause
          : `${condition} ${clause}`

        const whereCauseReplaced = this.replaceParamPlaceholders(
          whereClauseWithPlaceholder,
          params,
        )

        return [
          whereCauseReplaced.query,
          whereCauseReplaced.params,
        ]
      })

    const builtWhereClauses = whereClauses
      .map(whereClause => whereClause[0])
      .join(' ')
    const whereParams = whereClauses
      .map(whereClause => whereClause[1])
      .flat()

    const whereStatement = `WHERE ${builtWhereClauses}`
    return [whereStatement, whereParams]
  }


  // TODO: Convert table and column case, keep column alias case
  private buildGroupBy(
    queryData: Pick<QueryData, 'groupBy'>,
  ): [string, DatabaseParams] | undefined {
    if (!queryData.groupBy?.length) {
      return undefined
    }

    const groupByColumns = queryData.groupBy.join(', ')

    const groupByStatement = `GROUP BY ${groupByColumns}`

    return [
      groupByStatement,
      undefined,
    ]
  }


  // TODO: Convert table and column case, keep column alias case
  private buildOrderBy(
    queryData: Pick<QueryData, 'orderBy'>,
  ): [string, DatabaseParams] | undefined {
    if (!queryData.orderBy?.length) {
      return undefined
    }

    const orderByColumns = queryData.orderBy
      .map(orderByClause => {
        const { column, direction } = orderByClause
        return `${column} ${direction}`
      })
      .join(', ')

    const orderByStatement = `ORDER BY ${orderByColumns}`

    return [
      orderByStatement,
      undefined,
    ]
  }


  private buildLimit(
    queryData: Pick<QueryData, 'limit'>,
  ): [string, DatabaseParams] | undefined {
    if (queryData.limit === undefined) {
      return undefined
    }

    const limitStatement = 'LIMIT ?'
    const limitParams = queryData.limit

    return [
      limitStatement,
      [limitParams],
    ]
  }


  private buildOffset(
    queryData: Pick<QueryData, 'offset'>,
  ): [string, DatabaseParams] | undefined {
    if (queryData.offset === undefined) {
      return undefined
    }

    const offsetStatement = 'OFFSET ?'
    const offsetParams = queryData.offset

    return [
      offsetStatement,
      [offsetParams],
    ]
  }
}
