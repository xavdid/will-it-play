import { boolIfInfo, videoWillPlay } from "../utils";

describe("utils", () => {
  describe("boolIfInfo", () => {
    const tests = [
      { inputValue: "batman", expected: true },
      { inputValue: "spiderman", expected: false },
      { inputValue: "ozymandias", expected: undefined },
    ];

    tests.forEach(({ inputValue, expected }) => {
      it(`should return ${String(expected)} if the value is ${
        expected ? "" : "not "
      }in ${expected === undefined ? "either" : "the"} set`, () => {
        const { value, valid } = boolIfInfo(
          new Set(["batman"]),
          new Set(["spiderman"]),
          inputValue
        );
        expect(value).toEqual(inputValue);
        expect(valid).toEqual(expected);
      });
    });
  });

  describe("videoWillPlay", () => {
    const tests = [
      { inputValue: [true, true, true], expected: true },
      { inputValue: [true, true, undefined], expected: undefined },
      { inputValue: [undefined, undefined, undefined], expected: undefined },
      { inputValue: [true, true, false], expected: false },
    ];

    tests.forEach(({ inputValue, expected }) => {
      it(`should return ${String(
        expected
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      )} if the input is ${(inputValue as any).map(String).join(", ")}`, () => {
        const output = videoWillPlay({
          video: { valid: inputValue[0] },
          audio: { valid: inputValue[1] },
          extension: { valid: inputValue[2], value: ".txt" },
        });
        expect(output).toEqual(expected);
      });
    });
  });
});
