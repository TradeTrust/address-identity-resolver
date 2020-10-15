import { useCallback, SetStateAction, Dispatch } from "react";
import createPersistedState from "use-persisted-state";
import { AddressBookLocalProps, ResolutionResult } from "../../types";
import { readAsText, csvToAddressBook } from "../../services/localAddressBookResolver";

interface UseAddressBook {
  addressBook: AddressBookLocalProps;
  setAddressBook: Dispatch<SetStateAction<AddressBookLocalProps>>;
  handleLocalAddressBookCsv: (csvFile: File) => Promise<void>;
  getIdentifier: (address: string) => ResolutionResult | undefined;
}

// add return types
export const useAddressBook = (): UseAddressBook => {
  const defaultAddressBook: AddressBookLocalProps = {};
  const [addressBook, setAddressBook] = createPersistedState("ADDRESS_BOOK")(defaultAddressBook);
  const handleLocalAddressBookCsv = useCallback(
    async (csvFile: File): Promise<void> => {
      const csv = await readAsText(csvFile);
      const addressBook = csvToAddressBook(csv);
      setAddressBook(addressBook);
    },
    [setAddressBook]
  ); // useCallback needed to prevent multiple calls

  const getIdentifier = useCallback(
    (address: string): ResolutionResult | undefined => {
      const result = addressBook[address.toLowerCase()];
      return result ? { result, source: "Local" } : undefined;
    },
    [addressBook]
  ); // useCallback needed to prevent multiple calls
  return { addressBook, setAddressBook, handleLocalAddressBookCsv, getIdentifier };
};
