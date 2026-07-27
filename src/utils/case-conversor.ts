
export class CaseConversor {


  static camelCaseToSnakeCase(value: string): string {
    const upperCaseCharRegex = /[A-Z]/g
    const leadingUnderscoreRegex = /^_/

    const result = value
      .replace(upperCaseCharRegex, char => `_${char.toLowerCase()}`)
      .replace(leadingUnderscoreRegex, '')

    return result
  }


  static snakeCaseToCamelCase(value: string): string {
    const lowerCaseCharRegex = /_[a-z]/g
    const leadingUpperCaseCharRegex = /^[A-Z]/

    const result = value
      .toLowerCase()
      .replace(lowerCaseCharRegex, char => char.toUpperCase())
      .replace(leadingUpperCaseCharRegex, char => char.toLowerCase())
      .replaceAll('_', '')

    return result
  }
}
