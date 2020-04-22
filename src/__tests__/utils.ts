import { boolIfInfo } from '../utils'

describe('utils', () => {
  describe('boolIfInfo', () => {
    const tests = [
      { inputValue: 'batman', expected: true },
      { inputValue: 'spiderman', expected: false },
      { inputValue: 'ozymandias', expected: undefined },
    ]

    tests.forEach(({ inputValue, expected }) => {
      it(`should return ${String(expected)} if the value is ${
        expected ? '' : 'not '
      }in ${expected === undefined ? 'either' : 'the'} set`, () => {
        const { value, valid } = boolIfInfo(
          new Set(['batman']),
          new Set(['spiderman']),
          inputValue
        )
        expect(value).toEqual(inputValue)
        expect(valid).toEqual(expected)
      })
    })
  })
})
