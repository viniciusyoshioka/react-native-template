import type { Constructor } from 'type-fest'

import type {
  ColumnMetadata,
  EntityMetadata,
  RepositoryMetadata,
} from './metadata.types.ts'


export class MetadataManager {


  private static readonly ENTITY_KEY = 'app:database:tables'
  private static readonly COLUMN_KEY = 'app:database:tables:columns'
  private static readonly REPOSITORY_KEY = 'app:database:repositories'


  static getEntityMetadata<Entity>(
    entityClass: Constructor<Entity>,
  ): EntityMetadata<Entity> | undefined {
    const metadata = Reflect.getMetadata(this.ENTITY_KEY, entityClass)
    return metadata as EntityMetadata<Entity> | undefined
  }

  static setEntityMetadata<Entity>(
    entityClass: Constructor<Entity>,
    metadata: EntityMetadata<Entity>,
  ): void {
    Reflect.defineMetadata(this.ENTITY_KEY, metadata, entityClass)
  }


  static getColumnMetadata<Entity>(
    entityClass: Constructor<Entity>,
    propertyName: string | symbol,
  ): ColumnMetadata | undefined {
    const metadata = Reflect.getMetadata(this.COLUMN_KEY, entityClass, propertyName)
    return metadata as ColumnMetadata | undefined
  }

  static setColumnMetadata<Entity>(
    target: Constructor<Entity>,
    propertyName: string | symbol,
    metadata: ColumnMetadata,
  ): void {
    Reflect.defineMetadata(this.COLUMN_KEY, metadata, target, propertyName)
  }


  static getRepositoryMetadata<Repository, Entity>(
    repositoryClass: Constructor<Repository>,
  ): RepositoryMetadata<Entity> | undefined {
    const metadata = Reflect.getMetadata(this.REPOSITORY_KEY, repositoryClass)
    return metadata as RepositoryMetadata<Entity> | undefined
  }

  static setRepositoryMetadata<Repository, Entity>(
    repositoryClass: Constructor<Repository>,
    metadata: RepositoryMetadata<Entity>,
  ): void {
    Reflect.defineMetadata(this.REPOSITORY_KEY, metadata, repositoryClass)
  }
}
