import { useCallback, useMemo, useState } from 'react'

import type { Database } from '../../core/database'
import type { BaseDatabaseError } from '../../core/errors'
import { MigrationEngine } from '../../core/migration'
import { MIGRATIONS } from '../../migrations'


export enum DatabaseInitializationStatus {
  CLOSED = 'CLOSED',
  OPENING = 'OPENING',
  ERROR_OPENING = 'ERROR_OPENING',
  MIGRATING = 'MIGRATING',
  ERROR_MIGRATING = 'ERROR_MIGRATING',
  READY = 'READY',
  CLOSING = 'CLOSING',
  ERROR_CLOSING = 'ERROR_CLOSING',
}

export interface DatabaseInitialization {
  status: DatabaseInitializationStatus
  error: BaseDatabaseError | null
  initialize: () => Promise<void>
  close: () => Promise<void>
}


const CAN_OPEN_STATUSES = [
  DatabaseInitializationStatus.CLOSED,
  DatabaseInitializationStatus.OPENING,
  DatabaseInitializationStatus.ERROR_OPENING,
  DatabaseInitializationStatus.ERROR_CLOSING,
]

const CAN_CLOSE_STATUSES = [
  DatabaseInitializationStatus.MIGRATING,
  DatabaseInitializationStatus.ERROR_MIGRATING,
  DatabaseInitializationStatus.READY,
]


export function useDatabaseInitialization(database: Database): DatabaseInitialization {


  const [status, setStatus] = useState(DatabaseInitializationStatus.CLOSED)
  const [error, setError] = useState<BaseDatabaseError | null>(null)


  const openDatabase = useCallback(async (): Promise<boolean> => {
    setStatus(DatabaseInitializationStatus.OPENING)
    setError(null)

    const canOpenDatabase = CAN_OPEN_STATUSES.includes(status)
    if (!canOpenDatabase) {
      return false
    }

    try {
      await database.initialize()
      return false
    } catch (error) {
      setStatus(DatabaseInitializationStatus.ERROR_OPENING)
      setError(error as BaseDatabaseError)
      return true
    }
  }, [database])

  const migrateDatabase = useCallback(async (): Promise<boolean> => {
    setStatus(DatabaseInitializationStatus.MIGRATING)

    try {
      const migrationEngine = new MigrationEngine(database, MIGRATIONS)
      await migrationEngine.runMigrationsUp()
      return false
    } catch (error) {
      setStatus(DatabaseInitializationStatus.ERROR_MIGRATING)
      setError(error as BaseDatabaseError)
      return true
    }
  }, [database])

  const closeDatabase = useCallback(async (): Promise<boolean> => {
    setStatus(DatabaseInitializationStatus.CLOSING)

    const canCloseDatabase = CAN_CLOSE_STATUSES.includes(status)
    if (!canCloseDatabase) {
      return false
    }

    try {
      await database.close()
      return false
    } catch (error) {
      setStatus(DatabaseInitializationStatus.ERROR_CLOSING)
      setError(error as BaseDatabaseError)
      return true
    }
  }, [database])


  const initialize = useCallback(async () => {
    const hasErrorOpening = await openDatabase()
    if (hasErrorOpening) return

    const hasErrorMigrating = await migrateDatabase()
    if (hasErrorMigrating) return

    setStatus(DatabaseInitializationStatus.READY)
  }, [openDatabase, migrateDatabase])

  const close = useCallback(async () => {
    const hasErrorClosing = await closeDatabase()
    if (hasErrorClosing) return

    setStatus(DatabaseInitializationStatus.CLOSED)
  }, [closeDatabase])


  const databaseInitialization = useMemo<DatabaseInitialization>(() => ({
    status,
    error,
    initialize,
    close,
  }), [status, error, initialize, close])


  return databaseInitialization
}
