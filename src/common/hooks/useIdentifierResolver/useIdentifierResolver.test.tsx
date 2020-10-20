import { act, renderHook } from "@testing-library/react-hooks";
import { useIdentifierResolver } from "./useIdentifierResolver";
import { useAddressBook } from "../useAddressBook";
import { getIdentityName } from "../../../services/addressResolver";

jest.mock("../useAddressBook");
const mockUseAddressBook = useAddressBook as jest.Mock;
const mockGetIdentifier = jest.fn();

jest.mock("../../../services/addressResolver");
const mockGetIdentityName = getIdentityName as jest.Mock;

describe("useIdentifierResolver", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    mockUseAddressBook.mockReturnValue({ getIdentifier: mockGetIdentifier });
    mockGetIdentifier.mockReturnValue(undefined);
  });

  it("should get resolvedIdentifier and identifierSource when getIdentifier called", async () => {
    expect.assertions(3);
    const sampleAddress = "0xa61B056dA0084a5f391EC137583073096880C2e3";
    const sampleResult = {
      result: "DBS",
      source: "Local",
    };
    mockGetIdentifier.mockReturnValueOnce(sampleResult);
    const { result } = renderHook(() => useIdentifierResolver(sampleAddress));

    expect(mockGetIdentifier).toHaveBeenCalledWith(sampleAddress.toLowerCase());
    expect(result.current.resolvedIdentifier).toStrictEqual(sampleResult.result);
    expect(result.current.identifierSource).toStrictEqual(sampleResult.source);
  });

  it("should get resolvedIdentifier and identifierSource when getIdentityName is called", async () => {
    expect.assertions(3);
    const sampleAddress = "0xa61B056dA0084a5f391EC137583073096880C2e3";
    const sampleResult = {
      result: "DBS",
      source: "API",
    };
    mockGetIdentityName.mockResolvedValue(sampleResult);
    const { result, waitForNextUpdate } = renderHook(() => useIdentifierResolver(sampleAddress));
    await act(async () => {
      await waitForNextUpdate();
    });

    expect(mockGetIdentityName).toHaveBeenCalledWith([], sampleAddress);
    expect(result.current.resolvedIdentifier).toStrictEqual(sampleResult.result);
    expect(result.current.identifierSource).toStrictEqual(sampleResult.source);
  });
});
