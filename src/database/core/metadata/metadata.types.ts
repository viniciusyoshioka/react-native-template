import type { Constructor } from 'type-fest'


export interface EntityMetadata<Entity> {
  entityClass: Constructor<Entity>
  tableName: string
}


export type ColumnType = 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'NULL'

export interface ColumnMetadata {
  name: string
  type: ColumnType
  isPrimaryKey?: boolean
  isNullable?: boolean
  defaultValue?: unknown
}


export interface RepositoryMetadata<Entity> {
  entityClass: Constructor<Entity>
}
