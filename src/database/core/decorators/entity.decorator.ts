import type { Constructor } from 'type-fest'

import type { EntityMetadata } from '../metadata'
import { MetadataManager } from '../metadata'


interface EntityOptions {
  tableName: string
}


export function EntityDecorator(options: EntityOptions): ClassDecorator {
  return (target: object): void => {
    const metadata: EntityMetadata<object> = {
      tableName: options.tableName,
      entityClass: target as Constructor<object>,
    }

    MetadataManager.setEntityMetadata(
      target as Constructor<object>,
      metadata,
    )
  }
}
