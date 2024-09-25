import { Dispatch, SetStateAction } from "react";
import createPersistedState from "use-persisted-state";
import { ThirdPartyAPIEntryProps } from "../../../types";

interface UseThirdPartyAPIEndpoints {
  thirdPartyAPIEndpoints: ThirdPartyAPIEntryProps[];
  setThirdPartyAPIEndpoints: Dispatch<SetStateAction<ThirdPartyAPIEntryProps[]>>;
  addThirdPartyAPIEndpoint: (newValues: ThirdPartyAPIEntryProps) => void;
  removeThirdPartyAPIEndpoint: (id: number) => void;
}

export const useThirdPartyAPIEndpoints = (): UseThirdPartyAPIEndpoints => {
  const defaultThirdPartyAPIEndpoints: ThirdPartyAPIEntryProps[] = [];
  const [thirdPartyAPIEndpoints, setThirdPartyAPIEndpoints] = createPersistedState("ADDRESS_THIRD_PARTY_ENDPOINTS")(
    defaultThirdPartyAPIEndpoints,
  );

  const addThirdPartyAPIEndpoint = (newValues: ThirdPartyAPIEntryProps): void => {
    setThirdPartyAPIEndpoints([...thirdPartyAPIEndpoints, newValues]);
  };

  const removeThirdPartyAPIEndpoint = (id: number): void => {
    const filtered = thirdPartyAPIEndpoints.filter((item, index) => {
      return index !== id;
    });
    setThirdPartyAPIEndpoints(filtered);
  };

  return { thirdPartyAPIEndpoints, setThirdPartyAPIEndpoints, addThirdPartyAPIEndpoint, removeThirdPartyAPIEndpoint };
};
