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

export interface ThirdPartyAPIEntryProps {
  name: string;
  endpoint: string;
  apiHeader: string;
  apiKey: string;
  path: {
    addressResolution?: string;
    entityLookup?: string;
  };
}

export interface AddressBookThirdPartyResultsProps {
  identifier: string;
  name: string;
  remarks: string;
}

export interface HeadersProps {
  [key: string]: string;
}
