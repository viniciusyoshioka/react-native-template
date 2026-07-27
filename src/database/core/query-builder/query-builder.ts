import type { Constructor } from 'type-fest'

import { MetadataManager } from '../metadata/metadata-manager.ts'
import { QueryDataBuilder } from './query-data-builder'
import type { QueryParser } from './query-parser'
import type { ContextExecution, QueryWithParams } from './types'


export class QueryBuilder<E> extends QueryDataBuilder {


  private readonly entityClass: Constructor<E>
  private readonly queryParser: QueryParser
  private readonly contextExecution: ContextExecution


  constructor(
    entityClass: Constructor<E>,
    queryParser: QueryParser,
    contextExecution: ContextExecution,
  ) {
    super()
    this.entityClass = entityClass
    this.queryParser = queryParser
    this.contextExecution = contextExecution
  }


  private instantiateEntity(entityData: Record<string, unknown>): E {
    const entityInstance = new this.entityClass()

    const sqlColumnToColumnNameMap = this.getSqlColumnToColumnNameMap(entityInstance)
    const sqlColumnNames = Object.keys(sqlColumnToColumnNameMap)
    sqlColumnNames.forEach(sqlColumnName => {
      const columnName = sqlColumnToColumnNameMap[sqlColumnName] as keyof E
      entityInstance[columnName] = entityData[sqlColumnName] as E[keyof E]
    })

    return entityInstance
  }

  private getSqlColumnToColumnNameMap(entityInstance: E): Record<string, string> {
    const entityKeys = Object.keys(entityInstance as object)

    const sqlColumnToColumnNameMap = entityKeys.reduce((acc, key) => {
      const metadata = MetadataManager.getColumnMetadata<E>(this.entityClass, key)
      if (!metadata) {
        throw new Error('Expected to have metadata')
      }

      acc[metadata.name] = key
      return acc
    }, {} as Record<string, string>)

    return sqlColumnToColumnNameMap
  }


  getQueryWithParams(): QueryWithParams {
    return this.queryParser.build(this.queryData)
  }


  async getOne(): Promise<E | undefined> {
    this.select('*')
    this.limit(1)

    const { query, params } = this.queryParser.build(this.queryData)

    const result = await this.contextExecution.executeAsync<Record<string, unknown>>(
      query,
      params,
    )

    const entity = result.rows?.at(0)

    if (entity) {
      return this.instantiateEntity(entity)
    }
    return undefined
  }

  async getOneRaw<T = unknown>(): Promise<T | undefined> {
    this.limit(1)

    const { query, params } = this.queryParser.build(this.queryData)

    const result = await this.contextExecution.executeAsync<T>(query, params)
    return result.rows?.at(0)
  }


  async getMany(): Promise<E[]> {
    this.select('*')

    const { query, params } = this.queryParser.build(this.queryData)

    const result = await this.contextExecution.executeAsync<Record<string, unknown>>(
      query,
      params,
    )

    const entities = result.rows ?? []
    return entities.map(entity => this.instantiateEntity(entity))
  }

  async getManyRaw<T = unknown>(): Promise<T[]> {
    const { query, params } = this.queryParser.build(this.queryData)

    const result = await this.contextExecution.executeAsync<T>(query, params)
    return result.rows ?? []
  }
}
