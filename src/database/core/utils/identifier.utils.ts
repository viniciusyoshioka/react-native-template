import { CaseConversor } from '@utils'


export class IdentifierUtils {


  static camelCaseIdentifierRegex = new RegExp(
    '[a-z][a-zA-Z0-9]*',
  )
  static snakeCaseIdentifierRegex = new RegExp(
    '[a-z_][a-z0-9_]*',
  )

  static camelCaseIdentifierWithPrefixRegex = new RegExp(
    `(${IdentifierUtils.camelCaseIdentifierRegex.source}\\.)?${IdentifierUtils.camelCaseIdentifierRegex.source}`,
  )
  static snakeCaseIdentifierWithPrefixRegex = new RegExp(
    `(${IdentifierUtils.snakeCaseIdentifierRegex.source}\\.)?${IdentifierUtils.snakeCaseIdentifierRegex.source}`,
  )

  static camelCaseIdentifierWithAliasRegex = new RegExp(
    `${IdentifierUtils.camelCaseIdentifierWithPrefixRegex.source}( (as|AS) ${IdentifierUtils.camelCaseIdentifierRegex.source})?`,
  )
  static snakeCaseIdentifierWithAliasRegex = new RegExp(
    `${IdentifierUtils.snakeCaseIdentifierWithPrefixRegex.source}( (as|AS) ${IdentifierUtils.snakeCaseIdentifierRegex.source})?`,
  )

  static snakeCaseIdentifierWithSnakeCasePrefixAndCamelCaseAlias = new RegExp(
    `${IdentifierUtils.snakeCaseIdentifierWithPrefixRegex.source}( (as|AS) ${IdentifierUtils.camelCaseIdentifierRegex.source})?`,
  )

  static paramPlaceholderRegex = new RegExp(
    `:(\\.{3})?${IdentifierUtils.camelCaseIdentifierRegex.source}`,
    'g',
  )


  private static assertIdentifierIsValidWithRegex(
    identifier: string,
    regex: RegExp,
  ): void {
    const isValid = regex.test(identifier)
    if (!isValid) {
      throw new Error(`Identifier "${identifier}" is not valid`)
    }
  }


  static assertCamelCaseIdentifierIsValid(identifier: string): void {
    const regex = new RegExp(
      `^${IdentifierUtils.camelCaseIdentifierRegex.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }

  static assertSnakeCaseIdentifierIsValid(identifier: string): void {
    const regex = new RegExp(
      `^${IdentifierUtils.snakeCaseIdentifierRegex.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }


  static assertCamelCaseIdentifierWithPrefixIsValid(identifier: string): void {
    const regex = new RegExp(
      `^${IdentifierUtils.camelCaseIdentifierWithPrefixRegex.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }

  static assertSnakeCaseIdentifierWithPrefixIsValid(identifier: string): void {
    const regex = new RegExp(
      `^${IdentifierUtils.snakeCaseIdentifierWithPrefixRegex.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }


  static assertCamelCaseIdentifierWithAliasIsValid(identifier: string): void {
    const regex = new RegExp(
      `^${IdentifierUtils.camelCaseIdentifierWithAliasRegex.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }

  static assertSnakeCaseIdentifierWithAliasIsValid(identifier: string): void {
    const regex = new RegExp(
      `^${IdentifierUtils.snakeCaseIdentifierWithAliasRegex.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }


  static assertSnakeCaseIdentifierWithSnakeCasePrefixAndCamelCaseAliasIsValid(
    identifier: string,
  ): void {
    const regex = new RegExp(
      `^${IdentifierUtils.snakeCaseIdentifierWithSnakeCasePrefixAndCamelCaseAlias.source}$`,
    )

    IdentifierUtils.assertIdentifierIsValidWithRegex(identifier, regex)
  }


  static replaceCamelCaseIdentifierWithSnakeCaseIdentifier(identifier: string): string {
    const regex = new RegExp(
      `^${IdentifierUtils.camelCaseIdentifierWithPrefixRegex.source}`,
    )

    const replacedCamelCaseIdentifier = identifier.replace(regex, match => {
      return CaseConversor.camelCaseToSnakeCase(match)
    })

    return replacedCamelCaseIdentifier
  }
}
