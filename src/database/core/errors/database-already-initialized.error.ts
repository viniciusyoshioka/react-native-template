import { BaseDatabaseError } from './base-database.error'


export class DatabaseAlreadyInitializedError extends BaseDatabaseError {
  constructor(message?: string) {
    const errorMessage = message ?? 'Database is already initialized'
    super(errorMessage)
  }
}
