import { typeORMDriver } from 'react-native-nitro-sqlite'
import { DataSource } from 'typeorm'

import { APP_ENTITIES, LOG_ENTITIES } from './entities/index.ts'
import { APP_MIGRATIONS, LOG_MIGRATIONS } from './migrations'


export const appDataSource = new DataSource({
  type: 'react-native',
  database: 'app-database.sqlite',
  location: 'default',
  driver: typeORMDriver,
  logging: false,
  entities: APP_ENTITIES,
  migrations: APP_MIGRATIONS,
  migrationsRun: true,
  synchronize: false,
  dropSchema: false,
})


export const logDataSource = new DataSource({
  type: 'react-native',
  database: 'log-database.sqlite',
  location: 'default',
  driver: typeORMDriver,
  logging: false,
  entities: LOG_ENTITIES,
  migrations: LOG_MIGRATIONS,
  migrationsRun: true,
  synchronize: false,
  dropSchema: false,
})
