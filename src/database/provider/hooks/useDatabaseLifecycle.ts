import { useCallback, useEffect, useState } from 'react'

import type { Database, DatabaseErrors } from '../../database'
import type { Repositories } from '../../internal-types'


interface DatabaseLifecycleParams {
  database: Database<unknown>
  onRepositoriesCreated: (repositories: Repositories) => void
}


export interface DatabaseLifecycleResponse {
  initializationErrors: DatabaseErrors | null
  migrationErrors: DatabaseErrors | null
  closeErrors: DatabaseErrors | null
}


export function useDatabaseLifecycle(
  params: DatabaseLifecycleParams,
): DatabaseLifecycleResponse {
  const { database, onRepositoriesCreated } = params


  const [response, setResponse] = useState<DatabaseLifecycleResponse>({
    initializationErrors: null,
    migrationErrors: null,
    closeErrors: null,
  })


  const initialize = useCallback(async () => {
    const initializationErrors = await database.initialize()
    if (initializationErrors.APP || initializationErrors.LOG) {
      setResponse(previousResponse => ({
        ...previousResponse,
        initializationErrors,
      }))
      return
    }

    const migrationErrors = await database.migrate()
    if (migrationErrors.APP || migrationErrors.LOG) {
      setResponse(previousResponse => ({
        ...previousResponse,
        migrationErrors,
      }))
      return
    }

    const repositories = database.getRepositories()
    onRepositoriesCreated(repositories)
  }, [database, onRepositoriesCreated])


  const finalize = useCallback(async () => {
    const closeErrors = await database.close()
    if (closeErrors.APP || closeErrors.LOG) {
      setResponse(previousResponse => ({
        ...previousResponse,
        closeErrors,
      }))
    }
  }, [database])


  useEffect(() => {
    initialize()

    return () => {
      finalize()
    }
  }, [])


  return response
}
