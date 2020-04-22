/**
 * return types will be a bool for definitely good/bad, but can also be undefined if we don't have definitive info
 */
export const boolIfInfo = (
  good: Set<string>,
  bad: Set<string>,
  value: string
) => ({
  value,
  valid: good.has(value) ? true : bad.has(value) ? false : undefined,
})
