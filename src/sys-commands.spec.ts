import { getIpAddrV4 } from "./sys-commands";

describe("utils", () => {
  describe("getIpAddrV4", () => {
    it("should return correct IP v4 address", () => {
      expect(function () {
        let ipV4 = getIpAddrV4();
        expect(ipV4).toMatch(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
        // Check address is not broadcast or subnet
        expect(ipV4!.split(".").every((x) => +x > 0 && +x < 255));
      }).not.toThrow();
    });
  });
});
