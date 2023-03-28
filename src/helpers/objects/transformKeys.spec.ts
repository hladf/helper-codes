import { keysToCamel, keysToSnake } from './transformKeys'

const mockObject = {
  underscored_field: 'bla',
  camelCasedField: 'ble',
  underscored_array: [{ camelCase: 'grr' }],
  camelCasedArray: [{ underscore_property: 'hello' }],
}

describe('keysToCamel utils helper', () => {
  it('Should transform keys to camel case', () => {
    const result = keysToCamel(mockObject)

    expect(result).toMatchObject({
      underscoredField: 'bla',
      camelCasedField: 'ble',
      underscoredArray: [{ camelCase: 'grr' }],
      camelCasedArray: [{ underscoreProperty: 'hello' }],
    })
  })
})

describe('keysToSnake utils helper', () => {
  it('Should transform keys to snake case', () => {
    const result = keysToSnake(mockObject)

    expect(result).toMatchObject({
      underscored_field: 'bla',
      camel_cased_field: 'ble',
      underscored_array: [{ camel_case: 'grr' }],
      camel_cased_array: [{ underscore_property: 'hello' }],
    })
  })
})
