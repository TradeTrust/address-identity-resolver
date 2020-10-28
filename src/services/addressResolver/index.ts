import axios, { AxiosError, AxiosResponse } from "axios";
import { join } from "path";
import {
  AddressBookThirdPartyResultsProps,
  HeadersProps,
  ResolutionResult,
  ThirdPartyAPIEntryProps,
} from "../../types";
import { getLogger } from "../../logger";
import { cachedAxios } from "./axiosClient";

const { trace, error } = getLogger("service:addressresolver");

// Returns an url with no trailing slash
export const getPath = (path: string, base: string): string => new URL(path, base).href;

interface EntityLookupProps {
  query: string;
  endpoint: string;
  apiHeader?: string;
  apiKey?: string;
}

const get = async ({
  url,
  apiHeader,
  apiKey,
  cache = false,
}: {
  url: string;
  apiHeader?: string;
  apiKey?: string;
  cache?: boolean;
}): Promise<AxiosResponse> => {
  const client = cache ? cachedAxios : axios;
  if (apiHeader && apiKey) {
    const headers: HeadersProps = {};
    headers[apiHeader] = apiKey;
    return client.get(url, { headers });
  } else {
    return client.get(url);
  }
};

export const entityLookup = async ({
  query,
  endpoint,
  apiHeader,
  apiKey,
}: EntityLookupProps): Promise<AddressBookThirdPartyResultsProps[]> => {
  const url = `${endpoint}search?q=${query}`;
  const response = await get({ url, apiHeader, apiKey });
  return response.data.identities;
};

export const resolveAddressIdentityByEndpoint = async (
  url: string,
  apiHeader: string,
  apiKey: string
): Promise<any | undefined> => {
  // Default TTL is 5 Mins to change timeout check https://github.com/kuitos/axios-extensions#cacheadapterenhancer
  try {
    const response = await get({
      url,
      apiHeader,
      apiKey,
      cache: true,
    });
    return response.data?.identity;
  } catch (e) {
    trace(`Resolve Address Status: ${e}`);
    return undefined;
  }
};

export const getIdentity = async (
  addresses: ThirdPartyAPIEntryProps[],
  address: string
): Promise<ResolutionResult | undefined> => {
  const identity = await addresses.reduce(async (accumulator, currentValue) => {
    if (await accumulator) return accumulator;
    if (!currentValue.path.addressResolution) return undefined;
    const url = getPath(join(currentValue.path.addressResolution, address), currentValue.endpoint);
    const identity = await resolveAddressIdentityByEndpoint(url, currentValue.apiHeader, currentValue.apiKey);
    if (!identity) return undefined;
    return { name: identity.name, resolvedBy: currentValue.name, source: identity.source };
  }, Promise.resolve<ResolutionResult | undefined>(undefined));

  return identity;
};

interface FeatureResponse {
  features: {
    addressResolution?: {
      location: string;
    };
    entityLookup?: {
      location: string;
    };
  };
  version: number;
}

export const getFeatures = async (url: string, apiHeader?: string, apiKey?: string): Promise<FeatureResponse> => {
  try {
    const response = await get({
      url,
      apiHeader,
      apiKey,
      cache: false,
    });
    return response.data;
  } catch (e) {
    const err: AxiosError = e;
    if (err.response?.data) {
      error(err.response.data);
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};
