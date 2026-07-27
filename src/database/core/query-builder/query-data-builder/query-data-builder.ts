import type { QueryData, QueryParams } from '../types'
import { OrderDirection, WhereCondition } from '../types'


// TODO: Throw custom error
export class QueryDataBuilder {


  protected readonly queryData: QueryData


  constructor() {
    this.queryData = this.buildDefaultQueryData()
  }


  private buildDefaultQueryData(): QueryData {
    return {
      select: ['*'],
      from: null,
    }
  }


  select(columns: string | string[]): this {
    const newColumns = typeof columns === 'string'
      ? [columns]
      : [...columns]

    this.queryData.select = newColumns

    return this
  }

  addSelect(columns: string | string[]): this {
    const newColumns = typeof columns === 'string'
      ? [columns]
      : [...columns]

    this.queryData.select.push(...newColumns)

    return this
  }


  from(tableName: string, alias?: string): this {
    this.queryData.from = tableName

    if (typeof alias === 'string') {
      this.queryData.fromAlias = alias
    } else {
      delete this.queryData.fromAlias
    }

    return this
  }


  where(clause: string, params?: QueryParams): this {
    this.queryData.where = []
    this.pushWhere(WhereCondition.AND, clause, params)
    return this
  }

  andWhere(clause: string, params?: QueryParams): this {
    this.pushWhere(WhereCondition.AND, clause, params)
    return this
  }

  orWhere(clause: string, params?: QueryParams): this {
    this.pushWhere(WhereCondition.OR, clause, params)
    return this
  }

  private pushWhere(
    condition: WhereCondition,
    clause: string,
    params?: QueryParams,
  ): void {
    this.queryData.where ??= []
    this.queryData.where.push({ condition, clause, params })
  }


  groupBy(columns: string | string[]): this {
    const newColumns = typeof columns === 'string'
      ? [columns]
      : [...columns]

    this.queryData.groupBy = newColumns

    return this
  }

  addGroupBy(columns: string | string[]): this {
    const newColumns = typeof columns === 'string'
      ? [columns]
      : [...columns]

    this.queryData.groupBy ??= []
    this.queryData.groupBy.push(...newColumns)

    return this
  }


  orderBy(column: string, direction = OrderDirection.ASC): this {
    this.queryData.orderBy = []
    this.queryData.orderBy.push({ column, direction })

    return this
  }

  addOrderBy(column: string, direction = OrderDirection.ASC): this {
    this.queryData.orderBy ??= []
    this.queryData.orderBy.push({ column, direction })

    return this
  }


  limit(limit: number): this {
    this.assertLimitIsValid(limit)
    this.queryData.limit = limit
    return this
  }

  private assertLimitIsValid(limit: number): void {
    const isNaN = Number.isNaN(limit)
    if (isNaN) {
      throw new Error('Limit cannot be NaN')
    }

    const isInfinite = !Number.isFinite(limit)
    if (isInfinite) {
      throw new Error('Limit cannot be infinity')
    }

    const isLesserThanOrEqualToZero = limit <= 0
    if (isLesserThanOrEqualToZero) {
      throw new Error('Limit cannot be lesser than or equal to 0')
    }

    const integerLimit = Math.trunc(limit)
    const isFloat = integerLimit !== limit
    if (isFloat) {
      throw new Error('Limit must be an integer number, received float')
    }
  }


  offset(offset: number): this {
    this.assertOffsetIsValid(offset)
    this.queryData.offset = offset
    return this
  }

  private assertOffsetIsValid(offset: number): void {
    const isNaN = Number.isNaN(offset)
    if (isNaN) {
      throw new Error('Offset cannot be NaN')
    }

    const isInfinite = !Number.isFinite(offset)
    if (isInfinite) {
      throw new Error('Offset cannot be infinity')
    }

    const isNegative = offset < 0
    if (isNegative) {
      throw new Error('Offset cannot be a negative number')
    }

    const integerOffset = Math.trunc(offset)
    const isFloat = integerOffset !== offset
    if (isFloat) {
      throw new Error('Offset must be an integer number, received float')
    }
  }
}
