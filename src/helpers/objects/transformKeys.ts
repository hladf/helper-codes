const isArray = function (array: unknown) {
  return Array.isArray(array)
}

const isObject = function (obj: unknown) {
  return obj === Object(obj) && !isArray(obj) && typeof obj !== 'function'
}

const toCamel = (word: string) => {
  return word.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

const toSnake = (s: string) => {
  return s.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
}

export const keysToCamel = <T = any>(obj: any): T => {
  if (isObject(obj)) {
    const n = {}

    Object.keys(obj).forEach((k) => {
      n[toCamel(k)] = keysToCamel(obj[k])
    })

    return n as T
  } else if (isArray(obj)) {
    return obj.map((i) => {
      return keysToCamel(i)
    })
  }

  return obj as T
}

export const keysToSnake = (obj: any): any => {
  if (isObject(obj)) {
    const n = {}

    Object.keys(obj).forEach((k) => {
      n[toSnake(k)] = keysToSnake(obj[k])
    })

    return n
  } else if (isArray(obj)) {
    return obj.map((i) => {
      return keysToSnake(i)
    })
  }

  return obj
}
