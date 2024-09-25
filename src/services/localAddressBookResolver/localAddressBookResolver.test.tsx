import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { csvToAddressBook, readAsText } from "./localAddressBookResolver";

const csvLines = [
  "Address,Identifier\n",
  "0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C,Bank of China\n",
  "0xa61B056dA0084a5f391EC137583073096880C2e3,DBS\n",
];
const sampleCsvFile = new File(csvLines, "local-addressbook.csv", {
  type: "text/csv;encoding:utf-8",
  lastModified: 0,
});
const csvString =
  "Address,Identifier\n0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C,Bank of China\n0xa61B056dA0084a5f391EC137583073096880C2e3,DBS\n";
const sampleAddressBook = {
  "0xe94e4f16ad40adc90c29dc85b42f1213e034947c": "Bank of China",
  "0xa61b056da0084a5f391ec137583073096880c2e3": "DBS",
};

describe("localAddressBookResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should convert file to text", async () => {
    expect.assertions(1);

    const result = await readAsText(sampleCsvFile);

    expect(result).toStrictEqual(csvString);
  });

  it("should convert string to addressbook format", async () => {
    expect.assertions(1);

    const result = csvToAddressBook(csvString);

    expect(result).toStrictEqual(sampleAddressBook);
  });
});
