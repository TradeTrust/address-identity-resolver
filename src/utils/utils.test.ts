import { describe, expect, it } from "@jest/globals";
import { isEthereumAddress } from "./utils";

describe("utils/isEthereumAddress", () => {
  it("should work", () => {
    expect(isEthereumAddress("0x")).toBe(false);
    expect(isEthereumAddress("")).toBe(false);
    expect(isEthereumAddress("foo")).toBe(false);
    expect(isEthereumAddress("0x67b5Bc373cAA527Cee654d6A0f629ba1E84fAd02")).toBe(true);
    expect(isEthereumAddress("0x67b5Bc373cAA527Cee654d6A0f629ba1E84fAd02".toLowerCase())).toBe(true);
  });
});
