import { BaseDatabaseError } from './base-database.error'


export class DatabaseConnectionError extends BaseDatabaseError {
  constructor(message?: string) {
    const errorMessage = message ?? 'Error connecting/disconnecting to the database'
    super(errorMessage)
  }
}
