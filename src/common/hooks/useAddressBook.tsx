import { useCallback, SetStateAction, Dispatch } from "react";
import createPersistedState from "use-persisted-state";
import { AddressBookLocalProps, ResolutionResult } from "../../types";

interface UseAddressBook {
  addressBook: AddressBookLocalProps;
  setAddressBook: Dispatch<SetStateAction<AddressBookLocalProps>>;
  getIdentifier: (arg0: string) => ResolutionResult | undefined;
}

// add return types
export const useAddressBook = (): UseAddressBook => {
  const defaultAddressBook: AddressBookLocalProps = {};
  const [addressBook, setAddressBook] = createPersistedState("ADDRESS_BOOK")(defaultAddressBook);
  const getIdentifier = useCallback(
    (address: string): ResolutionResult | undefined => {
      const result = addressBook[address.toLowerCase()];
      return result ? { result, source: "Local" } : undefined;
    },
    [addressBook]
  ); // useCallback needed to prevent multiple calls
  return { addressBook, setAddressBook, getIdentifier };
};
