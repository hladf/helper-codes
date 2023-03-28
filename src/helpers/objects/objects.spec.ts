import { get } from './objects'

const simpleObject = { a: { b: 2 } }
const complexObject = { a: [{ bar: { c: 3 } }] }
const falsyObject = { a: null, b: undefined, c: 0 }

describe('Get utils helper', () => {
  it('Should return 2 when accessing a.b', () => {
    const result = get(simpleObject, 'a.b')
    expect(result).toBe(2)
  })

  it('Should return 3 when accessing a[0].bar.c', () => {
    const result = get(complexObject, 'a[0].bar.c')
    expect(result).toBe(3)
  })

  it('Should return 3 when accessing ["a", "0", "bar", "c"]', () => {
    const result = get(complexObject, ['a', '0', 'bar', 'c'])
    expect(result).toBe(3)
  })

  it('Should return defaultValue when accessing an non existing path', () => {
    const result = get(simpleObject, 'does_not_exists', 'defaultValue')
    expect(result).toBe('defaultValue')
  })

  it('Should return defaultValue when accessing an undefined value', () => {
    const result = get(falsyObject, 'b', 'defaultValue')
    expect(result).toBe('defaultValue')
  })

  it('Should return null when accessing an null value path', () => {
    const result = get(falsyObject, 'a', 'defaultValue')
    expect(result).toBe(null)
  })

  it('Should return 0 when accessing an 0 value path', () => {
    const result = get(falsyObject, 'c', 'defaultValue')
    expect(result).toBe(0)
  })

  it('Should return undefined when path is invalid and no default value is provided', () => {
    const result = get(simpleObject, 'does_not_exists')
    expect(result).toBe(undefined)
  })
})
