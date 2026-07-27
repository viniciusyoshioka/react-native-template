import { type Constructor } from 'type-fest'

import type { Database, DatabaseResult } from '../database'
import type { ColumnMetadata, EntityMetadata } from '../metadata'
import { MetadataManager } from '../metadata'
import type { ContextExecution } from '../query-builder'
import { QueryBuilder, SqliteQueryParser } from '../query-builder'
import type { FindOneOptions, PrimaryKeyColumn } from './repository.types.ts'


export abstract class Repository<E> {


  private readonly database: Database


  constructor(database: Database) {
    this.database = database
  }


  // TODO: Add custom error
  private getEntityClass(): Constructor<E> {
    const repositoryMetadata = MetadataManager.getRepositoryMetadata<Repository<E>, E>(
      this.constructor as Constructor<Repository<E>>,
    )

    if (!repositoryMetadata) {
      throw new Error(`Expected to have metadata for ${this.constructor.name}`)
    }
    return repositoryMetadata.entityClass
  }

  // TODO: Add custom error
  private getEntityMetadata(): EntityMetadata<E> {
    const entityClass = this.getEntityClass()
    const entityMetadata = MetadataManager.getEntityMetadata(entityClass)

    if (!entityMetadata) {
      throw new Error(`Expected to have entity metadata for ${entityClass.name}`)
    }
    return entityMetadata
  }

  private getTableName(): string {
    const entityMetadata = this.getEntityMetadata()
    return entityMetadata.tableName
  }

  private getTableColumns(): Record<string, ColumnMetadata> {
    const entityClass = this.getEntityClass()
    const entityInstance = new entityClass()

    console.log('entityClass', entityClass)
    console.log('entityInstance', entityInstance)

    const entityKeys = Object.keys(entityInstance as object)
    return entityKeys.reduce((acc, key) => {
      const columnMetadata = MetadataManager.getColumnMetadata(entityClass, key)
      console.log('columnMetadata', columnMetadata)
      if (!columnMetadata) {
        return acc
      }

      acc[key] = columnMetadata
      return acc
    }, {} as Record<string, ColumnMetadata>)
  }


  private buildContextExecution(): ContextExecution {
    const executeAsync = async <T = unknown>(
      query: string,
      params?: unknown[],
    ): Promise<DatabaseResult<T>> => {
      return await this.database.executeAsync(query, params)
    }


    const contextExecution: ContextExecution = {
      executeAsync,
    }


    return contextExecution
  }


  protected createQueryBuilder(tableAlias?: string): QueryBuilder<E> {
    const entityClass = this.getEntityClass()
    const queryParser = new SqliteQueryParser()
    const contextExecution = this.buildContextExecution()

    const queryBuilder = new QueryBuilder(
      entityClass,
      queryParser,
      contextExecution,
    )

    const tableName = this.getTableName()
    return queryBuilder.from(tableName, tableAlias)
  }


  async query<T = unknown>(sql: string, params?: unknown[]): Promise<DatabaseResult<T>> {
    return await this.database.executeAsync<T>(sql, params)
  }


  // TODO: Support other operators in where (IN, LIKE, etc)
  // TODO: Move each option to a separated method that manipulates the query
  async findOne(
    primaryKey: unknown,
    options?: FindOneOptions<E>,
  ): Promise<E | undefined> {
    const primaryKeyColumn = this.getPrimaryKeyColumn()


    const query = this.createQueryBuilder()
      .where(`${primaryKeyColumn.name} = :primaryKey`, { primaryKey })
      .limit(1)


    if (options?.where !== undefined) {
      const whereColumns = Object.keys(options.where)

      for (let i = 0; i < whereColumns.length; i++) {
        const whereColumn = whereColumns[i]

        const whereValue = options.where[whereColumn as keyof E]
        if (whereValue === undefined) continue

        query.andWhere(`${whereColumn} = :whereValue`, { whereValue })
      }
    }

    if (options?.orderBy !== undefined) {
      const orderByColumns = Object.keys(options.orderBy)

      for (let i = 0; i < orderByColumns.length; i++) {
        const orderByColumn = orderByColumns[i]
        const orderByDirection = options.orderBy[orderByColumn as keyof E]
        query.addOrderBy(orderByColumn, orderByDirection)
      }
    }

    if (options?.groupBy !== undefined) {
      query.groupBy(options.groupBy)
    }

    if (options?.offset !== undefined) {
      query.offset(options.offset)
    }


    return await query.getOne()
  }

  // TODO: Throw custom error
  private getPrimaryKeyColumn(): PrimaryKeyColumn {
    const tableColumns = this.getTableColumns()

    const primaryKeyColumn = Object.entries(tableColumns)
      .find(entry => {
        const columnMetadata = entry[1]
        return !!columnMetadata.isPrimaryKey
      })

    if (!primaryKeyColumn) {
      throw new Error('Expected to find a primary column')
    }

    return {
      name: primaryKeyColumn[0],
      metadata: primaryKeyColumn[1],
    }
  }


  // TODO: Improve type. Remove primary key, createdAt, updatedAt and deletedAt when
  // present, and automatically set these values here
  async create(data: Partial<E>): Promise<E> {
    const sanitizedData = this.sanitizeEntityDataObject(data)
    console.log('data', data)
    console.log('sanitizedData', sanitizedData)

    const sqlTableName = this.getTableName()

    const entityDataKeys = Object.keys(sanitizedData)

    const sqlColumnNames = this.getSqlTableColumnNamesFromEntityData(sanitizedData)
    const joinedColumnNames = sqlColumnNames.join(', ')
    const valuesPlaceholder = sqlColumnNames.map(_ => '?').join(', ')

    const values = entityDataKeys.map(key => data[key as keyof E])

    const query = `
      INSERT INTO ${sqlTableName} (${joinedColumnNames}) VALUES (${valuesPlaceholder});
    `

    console.log('query', query)
    console.log('values', values)

    const result = await this.database.executeAsync(query, values)
    console.log('result', result)

    if (result.insertId === undefined) {
      throw new Error('insertId not returned from entity creation')
    }

    const createdEntity = await this.findOne(result.insertId)
    if (!createdEntity) {
      throw new Error('Created entity with id ${} was not found right after creation')
    }

    return createdEntity
  }

  // TODO: Review
  private getSqlTableColumnNamesFromEntityData(data: Partial<E>): string[] {
    const tableColumns = this.getTableColumns()

    const entityDataKeys = Object.keys(data)
    const sqlColumnNames = Object.keys(tableColumns)
      .filter(key => entityDataKeys.includes(key))
      .map(columnName => tableColumns[columnName].name)

    console.log('tableColumns', tableColumns)
    console.log('entityDataKeys', entityDataKeys)
    console.log('sqlColumnNames', sqlColumnNames)

    return sqlColumnNames
  }


  private sanitizeEntityDataObject<T extends Record<string, unknown>>(data: T): T {
    const clonedData: T = { ...data }

    this.deleteExtraFieldsFromEntityData(clonedData)
    this.deleteUndefinedFieldsFromEntityData(clonedData)

    return clonedData
  }

  private deleteExtraFieldsFromEntityData(data: Record<string, unknown>): void {
    const extraKeys = this.getKeysThatDoesNotBelongsToEntity(data)

    for (let i = 0; i < extraKeys.length; i++) {
      const key = extraKeys[i]
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete data[key]
    }
  }

  private deleteUndefinedFieldsFromEntityData(data: Record<string, unknown>): void {
    const entityKeys = this.getKeysThatBelongsToEntity(data)

    for (let i = 0; i < entityKeys.length; i++) {
      const key = entityKeys[i]

      if (data[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[key]
      }
    }
  }


  private getKeysThatDoesNotBelongsToEntity(data: Record<string, unknown>): string[] {
    const entityClass = this.getEntityClass()
    const entityInstance = new entityClass()

    const entityKeys = Object.keys(entityInstance as object)
    const entityKeysSet = new Set(entityKeys)

    return Object
      .keys(data)
      .filter(key => !entityKeysSet.has(key))
  }

  private getKeysThatBelongsToEntity(data: Record<string, unknown>): string[] {
    const entityClass = this.getEntityClass()
    const entityInstance = new entityClass()

    const entityKeys = Object.keys(entityInstance as object)
    const entityKeysSet = new Set(entityKeys)

    return Object
      .keys(data)
      .filter(key => entityKeysSet.has(key))
  }
}
