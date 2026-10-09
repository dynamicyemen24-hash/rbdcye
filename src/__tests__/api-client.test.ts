import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("API retry safety", () => {
  it("retries a GET after a transient network failure", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary network failure"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ healthy: true }),
      } as Response);
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      apiClient.get<{ healthy: boolean }>("/health", {
        retries: 1,
        retryDelay: 0,
        timeout: 500,
      }),
    ).resolves.toEqual({ healthy: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not automatically replay a POST after a network failure", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("connection lost"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      apiClient.post("/donations", { amount: 100 }, {
        retries: 3,
        retryDelay: 0,
        timeout: 500,
      }),
    ).rejects.toThrow("connection lost");

    // A retry could create a second donation when the first response is lost.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("serializes falsey JSON payloads instead of silently dropping them", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ accepted: true }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    await apiClient.post("/settings/flag", false, {
      retries: 0,
      timeout: 500,
    });

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ body: "false" });
  });
});
