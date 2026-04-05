import { BaseDatabaseError } from './base-database.error'


export class DatabaseNotInitializedError extends BaseDatabaseError {
  constructor(message?: string) {
    const errorMessage = message ?? 'Database has not been initialized yet'
    super(errorMessage)
  }
}
