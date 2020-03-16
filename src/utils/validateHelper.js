const MAX_INT64 = Math.pow(2, 63)

/**
 * validate the input number.
 * @param {Number} value
 */
export const checkNumber = (value, name = "input number") => {
  if (value <= 0) {
    throw new Error(`${name} should be a positive number`)
  }

  if (MAX_INT64 <= value) {
    throw new Error(`${name} should be less than 2^63`)
  }
}