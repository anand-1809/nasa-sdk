import { describe, it, expect, beforeEach, vi } from "vitest";
import { NasaSDK } from "../src/client";
import type { ApodResponse } from "../src/types";

describe("NasaSDK", () => {
  let sdk: NasaSDK;
  const mockData: ApodResponse = {
    date: "2025-12-29",
    explanation: "Test explanation",
    media_type: "image",
    service_version: "v1",
    title: "Test Title",
    url: "https://example.com/image.jpg",
    hdurl: "https://example.com/image_hd.jpg",
  };

  beforeEach(() => {
    sdk = new NasaSDK({ apiKey: "DEMO_KEY", retries: 1, retryDelayMs: 0 });
    vi.resetAllMocks();
  });

  it("fetches APOD successfully", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await sdk.getApod();
    expect(result.title).toBe("Test Title");
  });

  it("throws error on API failure", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(sdk.getApod()).rejects.toThrow("NASA_SDK_ERROR");
  });

  it("fails when validation fails", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: "data" }),
    });

    await expect(sdk.getApod()).rejects.toThrow();
  });
});
