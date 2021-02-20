import { parsePortExpressionList } from "./port-expressions";

describe("utils", () => {
  describe("port parsing", () => {
    it("should parse port expression list", () => {
      const portMap = parsePortExpressionList([
        "1010",
        "2000-2002",
        "3000:4000",
        "0",
      ]);
      expect(portMap).toEqual([
        [1010, 1010],
        [2000, 2000],
        [2001, 2001],
        [2002, 2002],
        [3000, 4000],
        [0, 0],
      ]);
    });
  });
});
