import { IdentifierUtils } from '../identifier.utils'


const VALID_CAMEL_CASE_IDENTIFIERS = [
  'identifier',
  'camelCaseIdentifier',
  'identifierWithNumber1234567890',
]

const INVALID_CAMEL_CASE_IDENTIFIERS = [
  '',
  '1invalid',
  'space in',
  'PascalCase',
  '1',
  'A',
  'camelCase_withUnderscore',
]


const VALID_SNAKE_CASE_IDENTIFIERS = [
  'identifier',
  'snake_case_identifier',
  'identifier_with_number_123',
  '_starting_with_underscore',
  'ending_with_underscore_',
  '__init__',
]

const INVALID_SNAKE_CASE_IDENTIFIERS = [
  '',
  '1invalid',
  'space in',
  'Pascal_Case',
  'camel_Case_With_underscores',
  '1',
  'A',
  'camelCase',
]


const VALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX = [
  'schema.table',
  'schemaName.table',
  'schema.tableName',
  'schemaName.tableName',
  'schemaNameWithNumber123.tableName',
  'schemaName.tableNameWithNumber123',
]

const INVALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX = [
  '1schema.table',
  'schema.1table',
  'Schema.table',
  'schema.Table',
  'SchemaName.table',
  'schema.TableName',
  'schema_name.table_name',
  'schema-name.table-name',
  '123.123',
  '_schemaName.table',
  'schemaName._tableName',
]


const VALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX = [
  'schema.table',
  'schema_name.table',
  'schema.table_name',
  'schema_name.table_name',
  'schema_name_with_number123.table_name',
  'schema_name.table_name_with_number123',
  'schema_name_with_number_123.table_name',
  'schema_name.table_name_with_number_123',
  '_schema_name._table_name',
  'schema_name_.table_name_',
]

const INVALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX = [
  '1schema.table',
  'schema.1table',
  'Schema.table',
  'schema.Table',
  'SchemaName.table',
  'schema.TableName',
  'schema_Name.table_Name',
  'Schema_Name.Table_Name',
  'schema-name.table-name',
  '123.123',
]


const VALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS = [
  'table as alias',
  'table as aliasName',
  'table as aliasWithNumber123',
  'table AS alias',
  'table AS aliasName',
  'table AS aliasWithNumber123',
  'schema.table as alias',
  'schema.table as aliasName',
  'schema.table as aliasWithNumber123',
  'schema.table AS alias',
  'schema.table AS aliasName',
  'schema.table AS aliasWithNumber123',
]

const INVALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS = [
  'schema.table aS aliasWithNumber123',
  'schema.table As aliasWithNumber123',
  ' as',
  ' as ',
  ' as 1alias',
  ' as AliasName',
  ' as Alias_Name',
  ' AS',
  ' AS ',
  ' AS 1alias',
  ' AS AliasName',
  ' AS Alias_Name',
  'table as',
  'table as ',
  'table as 1alias',
  'table as AliasName',
  'table as Alias_Name',
  'table AS',
  'table AS ',
  'table AS 1alias',
  'table AS AliasName',
  'table AS Alias_Name',
  'schema.table as',
  'schema.table as ',
  'schema.table as 1alias',
  'schema.table as AliasName',
  'schema.table as Alias_Name',
  'schema.table AS',
  'schema.table AS ',
  'schema.table AS 1alias',
  'schema.table AS AliasName',
  'schema.table AS Alias_Name',
]


const VALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS = [
  'table as alias',
  'table as _alias',
  'table as alias_',
  'table as _alias_',
  'table as alias_name',
  'table as alias_with_number123',
  'table as alias_with_number_123',
  'table AS alias',
  'table AS alias_name',
  'table AS alias_with_number123',
  'table AS alias_with_number_123',
  'schema.table as alias',
  'schema.table as alias_name',
  'schema.table as alias_with_number123',
  'schema.table as alias_with_number_123',
  'schema.table AS alias',
  'schema.table AS alias_name',
  'schema.table AS alias_with_number123',
  'schema.table AS alias_with_number_123',
]

const INVALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS = [
  'schema.table a_s alias_with_number123',
  'schema.table As alias_with_number123',
  'schema.table aS alias_with_number123',
  ' as',
  'as ',
  ' as ',
  ' as 1',
  ' as A',
  ' as 1alias',
  ' as Alias_name',
  ' as alias_Name',
  ' as aliasName',
  ' as AliasName',
  ' AS',
  'AS ',
  ' AS ',
  ' AS 1',
  ' AS A',
  ' AS 1alias',
  ' AS Alias_name',
  ' AS alias_Name',
  ' AS aliasName',
  ' AS AliasName',
  'table as',
  'table as ',
  'table as 1',
  'table as A',
  'table as 1alias',
  'table as Alias_name',
  'table as alias_Name',
  'table as aliasName',
  'table as AliasName',
  'table AS',
  'table AS ',
  'table AS 1',
  'table AS A',
  'table AS 1alias',
  'table AS Alias_name',
  'table AS alias_Name',
  'table AS aliasName',
  'table AS AliasName',
  'schema.table AS',
  'schema.table AS ',
  'schema.table AS 1',
  'schema.table AS A',
  'schema.table AS 1alias',
  'schema.table AS alias_Name',
  'schema.table AS Alias_name',
  'schema.table AS Alias_Name',
  'schema.table AS AliasName',
  'schema.table as',
  'schema.table as ',
  'schema.table as 1',
  'schema.table as A',
  'schema.table as 1alias',
  'schema.table as alias_Name',
  'schema.table as Alias_name',
  'schema.table as Alias_Name',
  'schema.table as AliasName',
]


const VALID_PARAM_PLACEHOLDERS = [
  ':param',
  ':camelCaseParam',
  ':paramWithNumber123',
  ':param123',
  ':...param',
  ':...camelCaseParam',
  ':...paramWithNumber123',
  ':...param123',
]

const INVALID_PARAM_PLACEHOLDERS = [
  ':123',
  ':123param',
  ':snake_case_param',
  ':PascalCase',
  ':camelCase_withUnderscore',
  ':Capitalized',
  ':with space',
  ':A',
  ':_',
  ':_a',
  ':a_',
  ':...123',
  ':...123param',
  ':...snake_case_param',
  ':...PascalCase',
  ':...camelCase_withUnderscore',
  ':...Capitalized',
  ':...with space',
  ':...A',
  ':..._',
  ':..._a',
  ':...a_',
  ':()',
  ':(123)',
  ':(123param)',
  ':(snake_case_param)',
  ':(PascalCase)',
  ':(camelCase_withUnderscore)',
  ':(Capitalized)',
  ':(with space)',
  ':(A)',
  ':(_)',
  ':(_a)',
  ':(a_)',
  ':(...123)',
  ':(...123param)',
  ':(...snake_case_param)',
  ':(...PascalCase)',
  ':(...camelCase_withUnderscore)',
  ':(...Capitalized)',
  ':(...with space)',
  ':(...A)',
  ':(..._)',
  ':(..._a)',
  ':(...a_)',
]

describe('paramPlaceholderRegex', () => {


  const paramPlaceholderRegex = new RegExp(
    `^${IdentifierUtils.paramPlaceholderRegex.source}$`,
  )


  test.each(VALID_PARAM_PLACEHOLDERS)(
    'should match valid param placeholder: "%s"',
    value => {
      expect(paramPlaceholderRegex.test(value)).toBe(true)
    },
  )


  test.each(INVALID_PARAM_PLACEHOLDERS)(
    'should not match invalid param placeholder: "%s"',
    value => {
      expect(paramPlaceholderRegex.test(value)).toBe(false)
    },
  )
})


describe('assertCamelCaseIdentifierIsValid', () => {


  test.each(VALID_CAMEL_CASE_IDENTIFIERS)(
    'should accept valid camel case identifier "%s"',
    value => {
      expect(() => IdentifierUtils.assertCamelCaseIdentifierIsValid(value)).not.toThrow()
    },
  )


  const INVALID_VALUES = [
    ...VALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX,
    ...VALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS,
    ...INVALID_CAMEL_CASE_IDENTIFIERS,
    ...INVALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX,
    ...INVALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(INVALID_VALUES)(
    'should throw for invalid camel case identifier "%s"',
    value => {
      expect(() => IdentifierUtils.assertCamelCaseIdentifierIsValid(value)).toThrow()
    },
  )
})


describe('assertSnakeCaseIdentifierIsValid', () => {


  test.each(VALID_SNAKE_CASE_IDENTIFIERS)(
    'should accept valid snake case identifier "%s"',
    value => {
      expect(() => IdentifierUtils.assertSnakeCaseIdentifierIsValid(value)).not.toThrow()
    },
  )


  const INVALID_VALUES = [
    ...VALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX,
    ...VALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS,
    ...INVALID_SNAKE_CASE_IDENTIFIERS,
    ...INVALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX,
    ...INVALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(INVALID_VALUES)(
    'should throw for invalid snake case identifier "%s"',
    value => {
      expect(() => IdentifierUtils.assertSnakeCaseIdentifierIsValid(value)).toThrow()
    },
  )
})


describe('assertCamelCaseIdentifierWithPrefixIsValid', () => {


  const VALID_VALUES = [
    ...VALID_CAMEL_CASE_IDENTIFIERS,
    ...VALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX,
  ]

  test.each(VALID_VALUES)(
    'should accept valid camel case identifier with prefix "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertCamelCaseIdentifierWithPrefixIsValid(value),
      ).not.toThrow()
    },
  )


  const INVALID_VALUES = [
    ...VALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS,
    ...INVALID_CAMEL_CASE_IDENTIFIERS,
    ...INVALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX,
    ...INVALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(INVALID_VALUES)(
    'should throw for invalid camel case identifier with prefix "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertCamelCaseIdentifierWithPrefixIsValid(value),
      ).toThrow()
    },
  )
})


describe('assertSnakeCaseIdentifierWithPrefixIsValid', () => {


  const VALID_VALUES = [
    ...VALID_SNAKE_CASE_IDENTIFIERS,
    ...VALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX,
  ]

  test.each(VALID_VALUES)(
    'should accept valid snake case identifier with prefix "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertSnakeCaseIdentifierWithPrefixIsValid(value),
      ).not.toThrow()
    },
  )


  const INVALID_VALUES = [
    ...VALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS,
    ...INVALID_SNAKE_CASE_IDENTIFIERS,
    ...INVALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX,
    ...INVALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(INVALID_VALUES)(
    'should throw for invalid snake case identifier "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertSnakeCaseIdentifierWithPrefixIsValid(value),
      ).toThrow()
    },
  )
})


describe('assertCamelCaseIdentifierWithAliasIsValid', () => {


  const VALID_VALUES = [
    ...VALID_CAMEL_CASE_IDENTIFIERS,
    ...VALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX,
    ...VALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(VALID_VALUES)(
    'should accept valid camel case identifier with alias "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertCamelCaseIdentifierWithAliasIsValid(value),
      ).not.toThrow()
    },
  )


  const INVALID_VALUES = [
    ...INVALID_CAMEL_CASE_IDENTIFIERS,
    ...INVALID_CAMEL_CASE_IDENTIFIERS_WITH_PREFIX,
    ...INVALID_CAMEL_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(INVALID_VALUES)(
    'should throw for invalid camel case identifier with alias "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertCamelCaseIdentifierWithAliasIsValid(value),
      ).toThrow()
    },
  )
})


describe('assertSnakeCaseIdentifierWithAliasIsValid', () => {


  const VALID_VALUES = [
    ...VALID_SNAKE_CASE_IDENTIFIERS,
    ...VALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX,
    ...VALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(VALID_VALUES)(
    'should accept valid snake case identifier with alias "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertSnakeCaseIdentifierWithAliasIsValid(value),
      ).not.toThrow()
    },
  )


  const INVALID_VALUES = [
    ...INVALID_SNAKE_CASE_IDENTIFIERS,
    ...INVALID_SNAKE_CASE_IDENTIFIERS_WITH_PREFIX,
    ...INVALID_SNAKE_CASE_IDENTIFIERS_WITH_ALIAS,
  ]

  test.each(INVALID_VALUES)(
    'should throw for invalid snake case identifier with alias "%s"',
    value => {
      expect(
        () => IdentifierUtils.assertSnakeCaseIdentifierWithAliasIsValid(value),
      ).toThrow()
    },
  )
})


describe('replaceCamelCaseIdentifierWithSnakeCaseIdentifier', () => {
  const CAMEL_CASE_TO_SNAKE_CASE_MAPPING: string[][] = [
    ['identifier', 'identifier'],
    ['camelCase', 'camel_case'],
    ['camelCaseWithNumber123', 'camel_case_with_number123'],
    ['table.column', 'table.column'],
    ['tableName.columnName', 'table_name.column_name'],
    ['tableName123.columnName123', 'table_name123.column_name123'],
    ['table.column AS alias', 'table.column AS alias'],
    ['tableName.columnName AS aliasName', 'table_name.column_name AS aliasName'],
    ['tableName123.columnName123 AS aliasName123', 'table_name123.column_name123 AS aliasName123'],
  ]

  test.each(CAMEL_CASE_TO_SNAKE_CASE_MAPPING)(
    'should replace camel case string (%s) with valid snake case (%s)',
    (...value) => {
      const [camelCaseValue, expectedSnakeCaseValue] = value

      const result = IdentifierUtils.replaceCamelCaseIdentifierWithSnakeCaseIdentifier(
        camelCaseValue,
      )

      expect(result).toBe(expectedSnakeCaseValue)
      expect(() => {
        // eslint-disable-next-line @stylistic/max-len
        IdentifierUtils.assertSnakeCaseIdentifierWithSnakeCasePrefixAndCamelCaseAliasIsValid(
          expectedSnakeCaseValue,
        )
      }).not.toThrow()
    },
  )
})
