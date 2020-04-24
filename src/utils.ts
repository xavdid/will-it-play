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

export interface ValidityInfo {
  video: { valid?: boolean; value?: string }
  audio: { valid?: boolean; value?: string }
  extension: { valid?: boolean; value: string }
}

/**
 * this returns the same triple option that boolIfInfo does:
 *  `true`, `false`, or `undefined` whether or not we have info
 */
export const videoWillPlay = ({
  video: { valid: videoValid },
  audio: { valid: audioValid },
  extension: { valid: extensionValid },
}: ValidityInfo): boolean | undefined => {
  const validityResults = [videoValid, audioValid, extensionValid]
  if (validityResults.every(Boolean)) {
    return true
  }

  if (validityResults.some((r) => r === false)) {
    return false
  }

  return undefined
}
