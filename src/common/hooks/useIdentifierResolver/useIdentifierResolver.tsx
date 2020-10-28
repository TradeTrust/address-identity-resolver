import { useEffect, useState } from "react";
import { getIdentity } from "../../../services/addressResolver";
import { useAddressBook } from "../useAddressBook";
import { useThirdPartyAPIEndpoints } from "../useThirdPartyAPIEndpoints";

interface UseIdentifierResolverProps {
  identityName: string;
  identityResolvedBy: string;
  identitySource?: string;
}

export const useIdentifierResolver = (address: string): UseIdentifierResolverProps => {
  const [identityName, setIdentityName] = useState("");
  const [identityResolvedBy, setIdentityResolvedBy] = useState("");
  const [identitySource, setIdentitySource] = useState("");
  const { thirdPartyAPIEndpoints } = useThirdPartyAPIEndpoints();
  const { getIdentifier } = useAddressBook();

  useEffect(() => {
    if (!address) return;
    setIdentityName(""); // unset identityName at beginning

    const resolveIdentity = async (): Promise<void> => {
      // resolve by address book first, then by third-party endpoint
      const identity = getIdentifier(address.toLowerCase()) || (await getIdentity(thirdPartyAPIEndpoints, address));
      if (identity) {
        setIdentityName(identity.name);
        setIdentityResolvedBy(identity.resolvedBy);
        setIdentitySource(identity.source);
      }
    };

    resolveIdentity();
  }, [address, getIdentifier, thirdPartyAPIEndpoints]);

  return { identityName, identityResolvedBy, identitySource };
};
