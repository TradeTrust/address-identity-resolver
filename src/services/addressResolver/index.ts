import axios, { AxiosError, AxiosResponse } from "axios";
import { join } from "path";
import queryString from "query-string";
import { getLogger } from "../../logger";
import { EntityLookupResponseProps, HeadersProps, ResolutionResult, ThirdPartyAPIEntryProps } from "../../types";
import { cachedAxios } from "./axiosClient";

const { trace, error } = getLogger("service:addressresolver");

// Returns an url with no trailing slash
export const getPath = (path: string, base: string): string => new URL(path, base).href;

interface EntityLookupProps {
  query: string;
  offset?: string;
  limit?: string;
  endpoint: string;
  apiHeader?: string;
  apiKey?: string;
  path: string;
}

interface ResolveAddressIdentityByEndpointProps {
  name: string;
  source: string;
  [key: string]: string; // to account for any other field that might be used from api response.
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
  limit,
  offset,
  query,
  endpoint,
  apiHeader,
  apiKey,
  path,
}: EntityLookupProps): Promise<EntityLookupResponseProps> => {
  const url = queryString.stringifyUrl({
    url: getPath(path, endpoint),
    query: {
      q: query,
      limit,
      offset,
    },
  });

  const response = await get({ url, apiHeader, apiKey });
  return response.data;
};

export const resolveAddressIdentityByEndpoint = async (
  url: string,
  apiHeader: string,
  apiKey: string
): Promise<ResolveAddressIdentityByEndpointProps | undefined> => {
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
    const err: any = e;
    if (err.response?.data) {
      error(err.response.data);
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};
