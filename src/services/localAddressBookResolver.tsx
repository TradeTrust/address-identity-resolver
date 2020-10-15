import { AddressBookCsvData, AddressBookLocalProps } from "../types";
import { parse } from "papaparse";
import { isEthereumAddress } from "../utils";

export const csvToAddressBook = (csv: string): AddressBookLocalProps => {
  const { data } = parse<AddressBookCsvData>(csv, { skipEmptyLines: true, header: true });
  const addressBook: AddressBookLocalProps = {};
  data.forEach((row, index) => {
    const identifierText = row.Identifier || row.identifier;
    const addressText = row.Address || row.address;
    if (!identifierText) throw new Error(`Row ${index} does not have an identifer`);
    if (!addressText) throw new Error(`Row ${index} does not have an address`);
    if (!isEthereumAddress(addressText))
      throw new Error(`${addressText} in row ${index} is not a valid Ethereum address`);
    addressBook[addressText.toLowerCase()] = identifierText;
  });
  return addressBook;
};

export const readAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (reader.error) {
      reject(reader.error);
    }
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(file);
  });
};
