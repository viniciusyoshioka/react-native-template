import { IdentifierUtils } from '../../utils'
import type { DatabaseParams, QueryData, QueryParams, QueryWithParams } from '../types'


// TODO: Throw custom errors
export abstract class QueryParser {


  abstract build(queryData: QueryData): QueryWithParams


  protected replaceParamPlaceholders(
    query: string,
    params?: QueryParams,
  ): QueryWithParams {
    const hasParamPlaceholder = this.hasParamPlaceholderInQuery(query)
    if (!hasParamPlaceholder) {
      return {
        query,
        params: undefined,
      }
    }

    this.assertParamsAreValid(params)


    // eslint-disable-next-line @typescript-eslint/init-declarations
    let paramPlaceholderMatch: RegExpExecArray | null
    let queryWithReplacedParamPlaceholders = query
    const databaseParams: DatabaseParams = []

    while (
      (paramPlaceholderMatch = IdentifierUtils.paramPlaceholderRegex.exec(query)) !== null
    ) {
      const [paramPlaceholder] = paramPlaceholderMatch

      const replacedQuery = this.replaceParamPlaceholder({
        query: queryWithReplacedParamPlaceholders,
        queryParams: params,
        paramPlaceholder,
      })

      queryWithReplacedParamPlaceholders = replacedQuery.query
      if (replacedQuery.params) {
        databaseParams.push(...replacedQuery.params)
      }
    }


    return {
      query: queryWithReplacedParamPlaceholders,
      params: databaseParams,
    }
  }

  private hasParamPlaceholderInQuery(query: string): boolean {
    const matchedPlaceholders = query.match(IdentifierUtils.paramPlaceholderRegex)
    return !!matchedPlaceholders
  }

  private assertParamsAreValid(
    params: QueryParams | undefined,
  ): asserts params is QueryParams {
    if (!params) {
      throw new Error('Missing expected params object')
    }

    const paramKeys = Object.keys(params)
    if (!paramKeys.length) {
      throw new Error('Params object is empty, expected at least one param')
    }
  }

  private replaceParamPlaceholder(params: {
    query: string
    queryParams: QueryParams
    paramPlaceholder: string
  }): QueryWithParams {
    const { query, queryParams, paramPlaceholder } = params

    const placeholderParamName = paramPlaceholder.replace(':', '').replace('...', '')
    const placeholderParamValue = queryParams[placeholderParamName]

    const isArrayPlaceholder = paramPlaceholder.startsWith(':...')
    if (isArrayPlaceholder) {
      return this.replacePlaceholderOfArrayParam({
        query,
        paramPlaceholder,
        placeholderParamName,
        placeholderParamValue: placeholderParamValue as unknown[],
      })
    }

    return this.replacePlaceholderOfSingleParam({
      query,
      paramPlaceholder,
      placeholderParamName,
      placeholderParamValue,
    })
  }

  private replacePlaceholderOfArrayParam(params: {
    query: string
    paramPlaceholder: string
    placeholderParamName: string
    placeholderParamValue: unknown[]
  }): QueryWithParams {
    const {
      query,
      paramPlaceholder,
      placeholderParamName,
      placeholderParamValue,
    } = params

    const placeholderParamValueIsArray = Array.isArray(placeholderParamValue)
    if (!placeholderParamValueIsArray) {
      throw new Error(`Expected param for placeholder "${placeholderParamName}" to be an array`)
    }

    const databasePlaceholder = placeholderParamValue.map(() => '?').join(', ')
    const replacedQuery = query.replace(paramPlaceholder, databasePlaceholder)

    return {
      query: replacedQuery,
      params: placeholderParamValue,
    }
  }

  private replacePlaceholderOfSingleParam(params: {
    query: string
    paramPlaceholder: string
    placeholderParamName: string
    placeholderParamValue: unknown
  }): QueryWithParams {
    const {
      query,
      paramPlaceholder,
      placeholderParamName,
      placeholderParamValue,
    } = params

    const placeholderParamValueIsArray = Array.isArray(placeholderParamValue)
    if (placeholderParamValueIsArray) {
      throw new Error(`Expected param for placeholder "${placeholderParamName}" to not be an array`)
    }

    const replacedQuery = query.replace(paramPlaceholder, '?')

    return {
      query: replacedQuery,
      params: [placeholderParamValue],
    }
  }
}
