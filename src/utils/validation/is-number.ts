
export interface IsNumberOptions {
  allowNegative?: boolean
  allowPositive?: boolean
  allowZero?: boolean
  allowFloat?: boolean
  allowNaN?: boolean
  allowInfinite?: boolean
}


const defaultIsNumberOptions: IsNumberOptions = {
  allowNegative: true,
  allowPositive: true,
  allowZero: true,
  allowFloat: true,
  allowNaN: false,
  allowInfinite: false,
}


export function isNumber(
  value: unknown,
  options = defaultIsNumberOptions,
): boolean {
  const {
    allowNegative,
    allowPositive,
    allowZero,
    allowFloat,
    allowNaN,
    allowInfinite,
  } = options

  if (typeof value !== 'number') {
    return false
  }

  if (!allowNegative) {
    const isNegative = value < 0
    if (isNegative) return false
  }

  if (!allowPositive) {
    const isPositive = value > 0
    if (isPositive) return false
  }

  if (!allowZero) {
    const isZero = value === 0
    if (isZero) return false
  }

  if (!allowFloat) {
    const isFloat = !Number.isInteger(value)
    if (isFloat) return false
  }

  if (!allowInfinite) {
    const isInfinite = !Number.isFinite(value)
    if (isInfinite) return false
  }

  if (!allowNaN) {
    const isNaN = Number.isNaN(value)
    if (isNaN) return false
  }

  return true
}
