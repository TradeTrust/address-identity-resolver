export interface AddressBookCsvData {
  Identifier?: string;
  identifier?: string;
  Address?: string;
  address?: string;
}

export interface AddressBookLocalProps {
  [key: string]: string;
}

export type ResolutionResult = {
  result: string;
  source: string;
};
