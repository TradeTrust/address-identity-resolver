import { act, renderHook } from "@testing-library/react-hooks";
import { useIdentifierResolver } from "./useIdentifierResolver";
import { useAddressBook } from "../useAddressBook";
import { getIdentity } from "../../../services/addressResolver";
import { ResolutionResult } from "../../../types";

jest.mock("../useAddressBook");
const mockUseAddressBook = useAddressBook as jest.Mock;
const mockGetIdentifier = jest.fn();

jest.mock("../../../services/addressResolver");
const mockGetIdentityName = getIdentity as jest.Mock;

describe("useIdentifierResolver", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    mockUseAddressBook.mockReturnValue({ getIdentifier: mockGetIdentifier });
    mockGetIdentifier.mockReturnValue(undefined);
  });

  it("should get identityName, identityResolvedBy and identitySource when getIdentifier called", async () => {
    expect.assertions(4);
    const sampleAddress = "0xa61B056dA0084a5f391EC137583073096880C2e3";
    const sampleResult: ResolutionResult = {
      name: "DBS",
      resolvedBy: "GOVTECH",
      source: "Local",
    };
    mockGetIdentifier.mockReturnValueOnce(sampleResult);
    const { result } = renderHook(() => useIdentifierResolver(sampleAddress));

    expect(mockGetIdentifier).toHaveBeenCalledWith(sampleAddress.toLowerCase());
    expect(result.current.identityName).toStrictEqual(sampleResult.name);
    expect(result.current.identityResolvedBy).toStrictEqual(sampleResult.resolvedBy);
    expect(result.current.identitySource).toStrictEqual(sampleResult.source);
  });

  it("should get resolvedIdentifier and identifierSource when getIdentityName is called", async () => {
    expect.assertions(4);
    const sampleAddress = "0xa61B056dA0084a5f391EC137583073096880C2e3";
    const sampleResult = {
      name: "DBS",
      resolvedBy: "GOVTECH",
      source: "API",
    };
    mockGetIdentityName.mockResolvedValue(sampleResult);
    const { result, waitForNextUpdate } = renderHook(() => useIdentifierResolver(sampleAddress));
    await act(async () => {
      await waitForNextUpdate();
    });

    expect(mockGetIdentityName).toHaveBeenCalledWith([], sampleAddress);
    expect(result.current.identityName).toStrictEqual(sampleResult.name);
    expect(result.current.identityResolvedBy).toStrictEqual(sampleResult.resolvedBy);
    expect(result.current.identitySource).toStrictEqual(sampleResult.source);
  });
});
