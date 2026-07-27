import type { Constructor } from 'type-fest'

import type { ColumnMetadata } from '../metadata'
import { MetadataManager } from '../metadata'


type ColumnType = 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'NULL'

interface ColumnOptions {
  name: string
  type: ColumnType
  isPrimaryKey?: boolean
  isNullable?: boolean
  defaultValue?: unknown
}


export function ColumnDecorator(options: ColumnOptions): PropertyDecorator {


  const { name, type, isPrimaryKey, isNullable, defaultValue } = options


  return (target: object, propertyName: string | symbol): void => {
    const metadata: ColumnMetadata = {
      name,
      type,
      defaultValue,
      isNullable,
      isPrimaryKey,
    }

    MetadataManager.setColumnMetadata(
      target.constructor as Constructor<object>,
      propertyName,
      metadata,
    )
  }
}
