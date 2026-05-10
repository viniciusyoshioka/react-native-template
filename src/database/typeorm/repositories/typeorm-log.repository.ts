import type { EntityManager } from 'typeorm'
import { Repository } from 'typeorm'

import type { Transaction } from '../../database'
import type { CreateLog, LogRepository } from '../../repositories'
import { TypeOrmTransaction } from '../database'
import type { TypeOrmLogEntity } from '../entities'


export class TypeOrmLogRepository
  extends Repository<TypeOrmLogEntity>
  implements LogRepository {


  async transaction<T = unknown>(
    runInTransaction: (tx: Transaction<EntityManager>) => Promise<T>,
  ): Promise<T> {
    return await this.manager.transaction(async tx => {
      const typeormTransaction = new TypeOrmTransaction(tx)
      return await runInTransaction(typeormTransaction)
    })
  }

  withinTransaction(
    transaction: Transaction<EntityManager>,
  ): this {
    const repositoryWithinTransaction = new TypeOrmLogRepository(
      this.target,
      transaction.underlyingContext,
    )

    return repositoryWithinTransaction as this
  }


  async insertLog(logToCreate: CreateLog): Promise<void> {
    const timestamp = Date.now()

    await this.insert({
      type: logToCreate.type,
      timestamp,
      message: logToCreate.message,
      stackTrace: logToCreate.stackTrace,
    })
  }
}
