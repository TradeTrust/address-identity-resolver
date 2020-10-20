import { wait } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useAddressBook } from "./useAddressBook";

const csvLines = [
  "Address,Identifier\n",
  "0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C,Bank of China\n",
  "0xa61B056dA0084a5f391EC137583073096880C2e3,DBS\n",
  "0x1D350495B4C2a51fBf1c9DEDadEAb288250C703e,China Oil\n",
  "0x28F7aB32C521D13F2E6980d072Ca7CA493020145,Standard Chartered\n",
  "0x1Dc271EaE22a83c9670571d1a206043E8a420fdE,Bank of Singapore\n",
  "0xac6ae639a84e64cB77324A02c9ce82706C8a99Ec,UOB\n",
];
const sampleCsvFile = new File(csvLines, "local-addressbook.csv", {
  type: "text/csv;encoding:utf-8",
  lastModified: 0,
});
const sampleAddressBook = {
  "0xe94e4f16ad40adc90c29dc85b42f1213e034947c": "Bank of China",
  "0xa61b056da0084a5f391ec137583073096880c2e3": "DBS",
  "0x1d350495b4c2a51fbf1c9dedadeab288250c703e": "China Oil",
  "0x28f7ab32c521d13f2e6980d072ca7ca493020145": "Standard Chartered",
  "0x1dc271eae22a83c9670571d1a206043e8a420fde": "Bank of Singapore",
  "0xac6ae639a84e64cb77324a02c9ce82706c8a99ec": "UOB",
};

describe("useAddressBook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should set addressBook when local csv file provided", async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useAddressBook());
    await act(async () => {
      await wait(() => {
        result.current.handleLocalAddressBookCsv(sampleCsvFile);
      });
    });
    expect(result.current.addressBook).toStrictEqual(sampleAddressBook);
  });

  it("should get identity if provided in local address book", async () => {
    expect.assertions(2);
    const { result } = renderHook(() => useAddressBook());

    await act(async () => {
      await wait(() => {
        result.current.handleLocalAddressBookCsv(sampleCsvFile);
      });
    });
    expect(result.current.addressBook).toStrictEqual(sampleAddressBook);
    const identityResult = result.current.getIdentifier("0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C");
    expect(identityResult).toStrictEqual({
      result: "Bank of China",
      source: "Local",
    });
  });

  it("should return undefined if no such idenitity in local address book", async () => {
    expect.assertions(2);
    const { result } = renderHook(() => useAddressBook());
    await act(async () => {
      await wait(() => {
        result.current.handleLocalAddressBookCsv(sampleCsvFile);
      });
    });
    expect(result.current.addressBook).toStrictEqual(sampleAddressBook);
    const identityResult = result.current.getIdentifier("0xcE26E13045363a4aFb1f4dc6b584256cCb0DDd14");
    expect(identityResult).toBeUndefined();
  });

  it("address book should be persistant", async () => {
    expect.assertions(2);
    const { result, rerender } = renderHook(() => useAddressBook());
    await act(async () => {
      await wait(() => {
        result.current.handleLocalAddressBookCsv(sampleCsvFile);
      });
    });
    expect(result.current.addressBook).toStrictEqual(sampleAddressBook);
    rerender();
    expect(result.current.addressBook).toStrictEqual(sampleAddressBook);
  });
});
