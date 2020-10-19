import { useEffect, useState } from "react";
import { getIdentityName } from "../../../services/addressResolver";
import { useAddressBook } from "../useAddressBook";
import { useThirdPartyAPIEndpoints } from "../useThirdPartyAPIEndpoints";

interface UseIdentifierResolverProps {
  resolvedIdentifier: string;
  identifierSource?: string;
}

export const useIdentifierResolver = (address: string): UseIdentifierResolverProps => {
  const [resolvedIdentifier, setResolvedIdentifier] = useState("");
  const [identifierSource, setIdentifierSource] = useState<string>();
  const { thirdPartyAPIEndpoints } = useThirdPartyAPIEndpoints();
  const { getIdentifier } = useAddressBook();

  useEffect(() => {
    if (!address) return;
    setResolvedIdentifier(""); // unset resolvedIdentifier at beginning

    const resolveIdentity = async (): Promise<void> => {
      // resolve by address book first, then by third-party endpoint
      const identityName =
        getIdentifier(address.toLowerCase()) || (await getIdentityName(thirdPartyAPIEndpoints, address));
      if (identityName) {
        setResolvedIdentifier(identityName.result);
        setIdentifierSource(identityName.source);
      }
    };

    resolveIdentity();
  }, [address, getIdentifier, thirdPartyAPIEndpoints]);

  return { resolvedIdentifier, identifierSource };
};
