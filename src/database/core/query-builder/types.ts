import type { DatabaseOperations } from '../database'


export type ContextExecution = Pick<DatabaseOperations, 'executeAsync'>


export type DatabaseParams = undefined | unknown[]

export type QueryParams = Record<string, unknown>


export enum WhereCondition {
  AND = 'AND',
  OR = 'OR',
}

export interface WhereClause {
  condition: WhereCondition
  clause: string
  params?: QueryParams
}


export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface OrderByClause {
  column: string
  direction: OrderDirection
}


export interface QueryData {
  select: string[]
  from: string | null
  fromAlias?: string
  where?: WhereClause[]
  groupBy?: string[]
  orderBy?: OrderByClause[]
  limit?: number
  offset?: number
}


export interface QueryWithParams {
  query: string
  params: DatabaseParams
}
