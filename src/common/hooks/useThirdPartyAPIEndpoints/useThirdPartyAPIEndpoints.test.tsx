import { wait } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useThirdPartyAPIEndpoints } from "./useThirdPartyAPIEndpoints";

const sampleThirdPartyAPIEntryArr = [
  {
    name: "Demo-1",
    endpoint: "https://www.demo1.com/",
    apiHeader: "x-api-key",
    apiKey: "DEMO1",
    path: {
      addressResolution: "/resolve",
      entityLookup: "/search",
    },
  },
  {
    name: "Demo-2",
    endpoint: "https://www.demo2.com/",
    apiHeader: "x-api-key",
    apiKey: "DEMO2",
    path: {
      addressResolution: "/resolve",
      entityLookup: "/search",
    },
  },
];

describe("useThirdPartyAPIEndpoints", () => {
  beforeEach(async () => {
    const { result } = renderHook(() => useThirdPartyAPIEndpoints());
    await act(async () => {
      result.current.setThirdPartyAPIEndpoints([]);
    });
    jest.resetAllMocks();
  });

  it("should set thirdPartyAPIEndpoints when setThirdPartyAPIEndpoints called", async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useThirdPartyAPIEndpoints());
    await act(async () => {
      result.current.setThirdPartyAPIEndpoints(sampleThirdPartyAPIEntryArr);
    });
    expect(result.current.thirdPartyAPIEndpoints).toStrictEqual(sampleThirdPartyAPIEntryArr);
  });

  it("should add API endpoint when addThirdPartyAPIEndpoint called", async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useThirdPartyAPIEndpoints());
    await act(async () => {
      result.current.addThirdPartyAPIEndpoint(sampleThirdPartyAPIEntryArr[0]);
    });
    expect(result.current.thirdPartyAPIEndpoints).toStrictEqual([sampleThirdPartyAPIEntryArr[0]]);
  });

  it("should remove API endpoint when removeThirdPartyAPIEndpoint called", async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useThirdPartyAPIEndpoints());
    await act(async () => {
      await wait(() => result.current.setThirdPartyAPIEndpoints(sampleThirdPartyAPIEntryArr));
      result.current.removeThirdPartyAPIEndpoint(0);
    });
    expect(result.current.thirdPartyAPIEndpoints).toStrictEqual([sampleThirdPartyAPIEntryArr[1]]);
  });

  it("thirdPartyAPIEndpoints should be persistant", async () => {
    expect.assertions(2);
    const { result, rerender } = renderHook(() => useThirdPartyAPIEndpoints());
    await act(async () => {
      result.current.setThirdPartyAPIEndpoints(sampleThirdPartyAPIEntryArr);
    });
    expect(result.current.thirdPartyAPIEndpoints).toStrictEqual(sampleThirdPartyAPIEntryArr);
    rerender();
    expect(result.current.thirdPartyAPIEndpoints).toStrictEqual(sampleThirdPartyAPIEntryArr);
  });
});
