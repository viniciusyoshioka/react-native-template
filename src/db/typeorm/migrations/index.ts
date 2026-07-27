import type { Constructor } from 'type-fest'
import type { MigrationInterface } from 'typeorm'


export const APP_MIGRATIONS: Constructor<MigrationInterface>[] = []


export const LOG_MIGRATIONS: Constructor<MigrationInterface>[] = []
