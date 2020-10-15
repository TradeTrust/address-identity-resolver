import { utils } from "ethers";

export const isEthereumAddress = (address: string): boolean => {
  try {
    if (utils.getAddress(address)) return true;
    return false;
  } catch (e) {
    if (e.reason == "invalid address") {
      return false;
    } else throw e;
  }
};
