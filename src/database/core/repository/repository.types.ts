import type { ColumnMetadata } from '../metadata/metadata.types.ts'
import type { OrderDirection } from '../query-builder'


export interface FindOptions<E> {
  where?: Partial<E>
  orderBy?: Record<keyof E, OrderDirection>
  groupBy?: string | string []
  limit?: number
  offset?: number
}


export interface FindOneOptions<E> extends Omit<FindOptions<E>, 'limit'> {}


// Internal types
export interface SeparatedEntityKeys {
  entityKeys: string[]
  extraKeys: string[]
}

export interface PrimaryKeyColumn {
  name: string
  metadata: ColumnMetadata
}
