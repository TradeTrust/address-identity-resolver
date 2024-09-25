import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import axios from "axios";
import { ThirdPartyAPIEntryProps } from "../../types";
import { getFeatures, getIdentity, getPath, entityLookup } from "./index";

jest.mock("axios");
jest.mock("./axiosClient");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("addressResolver", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  describe("getIdentity", () => {
    it("should return the first name if it can be found with any resolver", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          identity: {
            identifier: "0xA",
            name: "ABC Pte Ltd",
            remarks: "Added by Raymond",
            source: "GovTech, Singapore",
          },
        },
      });

      const endpoints = [
        {
          id: "1",
          name: "demo",
          endpoint: "https://demo-resolver.tradetrust.io/",
          apiHeader: "",
          apiKey: "",
          path: {
            addressResolution: "/identifier",
          },
        },
      ];

      const identity = await getIdentity(endpoints, "0xA");

      expect(identity).toEqual({ name: "ABC Pte Ltd", resolvedBy: "demo", source: "GovTech, Singapore" });
    });

    it("should return undefined if it cannot be resolved anywhere", async () => {
      mockedAxios.get.mockRejectedValueOnce({
        data: {
          message: "No profile found for 0xB",
        },
      });

      const endpoints = [
        {
          id: "1",
          name: "demo",
          endpoint: "https://demo-resolver.tradetrust.io/identifier/",
          apiHeader: "",
          apiKey: "",
          path: {
            addressResolution: "/identifier",
          },
        },
      ];

      const identity = await getIdentity(endpoints, "0xB");

      expect(identity).toBeUndefined();
    });

    it("should return undefined with empty resolver list", async () => {
      mockedAxios.get.mockRejectedValueOnce({
        data: {
          message: "No profile found for 0xC",
        },
      });

      const endpoints: ThirdPartyAPIEntryProps[] = [];

      const identity = await getIdentity(endpoints, "0xC");

      expect(identity).toBeUndefined();
    });

    it("should work for url with trailing slashes", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          identity: {
            identifier: "0xA",
            name: "ABC Pte Ltd",
            remarks: "Added by Raymond",
            source: "GovTech, Singapore",
          },
        },
      });

      const endpoints = [
        {
          id: "1",
          name: "demo",
          endpoint: "https://demo-resolver.tradetrust.io/",
          apiHeader: "",
          apiKey: "",
          path: {
            addressResolution: "/identifier/",
          },
        },
      ];

      const identity = await getIdentity(endpoints, "0xA");

      expect(mockedAxios.get.mock.calls[0][0]).toBe("https://demo-resolver.tradetrust.io/identifier/0xA");
      expect(identity).toEqual({ name: "ABC Pte Ltd", resolvedBy: "demo", source: "GovTech, Singapore" });
    });
  });

  describe("getPath", () => {
    it("should return url resolved from the base url", () => {
      expect(getPath("/bark", "https://cow.com/chicken")).toBe("https://cow.com/bark");
      expect(getPath("bark", "https://cow.com/")).toBe("https://cow.com/bark");
      expect(getPath("/second/level", "https://cow.com/")).toBe("https://cow.com/second/level");
    });
  });

  describe("getFeatures", () => {
    it("should return the features data when successful", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          features: {
            addressResolution: {
              location: "/identifier",
            },
            entityLookup: {
              location: "/search",
            },
          },
        },
      });
      const res = await getFeatures("https://some.url", "", "");

      expect(res).toEqual({
        features: {
          addressResolution: { location: "/identifier" },
          entityLookup: { location: "/search" },
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith("https://some.url");
    });

    it("should include the api headers when its provided", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          features: {
            addressResolution: {
              location: "/identifier",
            },
            entityLookup: {
              location: "/search",
            },
          },
        },
      });
      const res = await getFeatures("https://some.url", "key", "value");

      expect(res).toEqual({
        features: {
          addressResolution: { location: "/identifier" },
          entityLookup: { location: "/search" },
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith("https://some.url", { headers: { key: "value" } });
    });

    it("should throw message returned from the api whenever possible", async () => {
      const e: any = new Error("Generic error message");
      e.response = { data: { message: "Some known error from server" } };
      mockedAxios.get.mockRejectedValueOnce(e);

      await expect(getFeatures("https://some.url", "key", "value")).rejects.toThrow(/Some known error from server/);
    });

    it("should throw generic error message when message is not available", async () => {
      const e = new Error("Generic error message");
      mockedAxios.get.mockRejectedValueOnce(e);

      await expect(getFeatures("https://some.url", "key", "value")).rejects.toThrow(/Generic error message/);
    });
  });

  describe("entityLookup", () => {
    const data = {
      identities: [
        {
          identifier: "0x3aaff3bf29cd85a7ba3dec33f5d0269e72097d26",
          name: "TradeSafe.Club",
          source: "",
          remarks: "Added by Marcus Ong",
        },
      ],
      count: 1,
      total: 1,
    };

    it("should call when endpoint is without trailing slash", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: data,
      });
      const response = await entityLookup({
        limit: "20",
        offset: "1",
        query: "Marcus",
        endpoint: "https://some.url",
        apiHeader: "x-api-key",
        apiKey: "DEMO",
        path: "/search",
      });

      expect(mockedAxios.get).toHaveBeenCalledWith("https://some.url/search?limit=20&offset=1&q=Marcus", {
        headers: { "x-api-key": "DEMO" },
      });
      expect(response).toEqual(data);
    });

    it("should call when endpoint is with trailing slash", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: data,
      });
      const response = await entityLookup({
        limit: "20",
        offset: "1",
        query: "Marcus",
        endpoint: "https://some.url/",
        apiHeader: "x-api-key",
        apiKey: "DEMO",
        path: "/search",
      });

      expect(mockedAxios.get).toHaveBeenCalledWith("https://some.url/search?limit=20&offset=1&q=Marcus", {
        headers: { "x-api-key": "DEMO" },
      });
      expect(response).toEqual(data);
    });
  });
});
