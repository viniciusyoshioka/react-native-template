import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react'

import type { Database } from '../core/database'
import { DatabaseInitializationStatus, useDatabaseInitialization } from './hooks'


// TODO: Rename or change type
export enum DatabaseNames {
  APP = 'APP',
  LOG = 'LOG',
}

export type DatabaseContext = Record<DatabaseNames, Database>


const DatabaseContext = createContext<DatabaseContext | null>(null)


export interface DatabaseProviderProps extends PropsWithChildren {
  databases: Record<DatabaseNames, Database>
}

// TODO: Handle errors
// TODO: Better handling of intermediary states
export function DatabaseProvider(props: DatabaseProviderProps) {
  const { databases, children } = props


  const logDatabaseInitialization = useDatabaseInitialization(databases.LOG)
  const appDatabaseInitialization = useDatabaseInitialization(databases.APP)

  const isReady = (
    logDatabaseInitialization.status === DatabaseInitializationStatus.READY
    && appDatabaseInitialization.status === DatabaseInitializationStatus.READY
  )


  const initializeDatabases = useCallback(async () => {
    await logDatabaseInitialization.initialize()
    await appDatabaseInitialization.initialize()
  }, [logDatabaseInitialization.initialize, appDatabaseInitialization.initialize])


  const closeDatabases = useCallback(async () => {
    await logDatabaseInitialization.close()
    await appDatabaseInitialization.close()
  }, [logDatabaseInitialization.close, appDatabaseInitialization.close])


  useEffect(() => {
    initializeDatabases()

    return () => {
      closeDatabases()
    }
  }, [])


  if (!isReady) {
    return null
  }


  return (
    <DatabaseContext.Provider value={databases}>
      {children}
    </DatabaseContext.Provider>
  )
}


export function useDatabase(): DatabaseContext {
  const context = useContext(DatabaseContext)

  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }

  return context
}
