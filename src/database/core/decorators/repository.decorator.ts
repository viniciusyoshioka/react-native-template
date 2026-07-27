import type { Constructor } from 'type-fest'

import type { RepositoryMetadata } from '../metadata'
import { MetadataManager } from '../metadata'


export function RepositoryDecorator<Entity>(
  entity: Constructor<Entity>,
): ClassDecorator {
  return (target: object): void => {
    const metadata: RepositoryMetadata<Entity> = {
      entityClass: entity,
    }

    MetadataManager.setRepositoryMetadata<object, Entity>(
      target as Constructor<object>,
      metadata,
    )
  }
}
