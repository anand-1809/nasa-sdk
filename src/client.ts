import {
  ApodSchema,
  ApodArraySchema,
  ApodResponse,
  SDKConfig,
} from './types';
import { withRetry } from './utils';

export class NasaSDK {
  private apiKey: string;
  private baseUrl = 'https://api.nasa.gov/planetary/apod';
  private retries: number;
  private retryDelayMs: number;

  constructor(config: SDKConfig) {
    this.apiKey = config.apiKey;
    this.retries = config.retries ?? 3;
    this.retryDelayMs = config.retryDelayMs ?? 500;
  }

  // -------------------------
  // Core fetch helper
  // -------------------------
  private async fetchRaw(
    params: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<unknown> {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('api_key', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const res = await fetch(url.toString(), { signal });

    if (!res) {
      throw new Error(
        "NASA_SDK_ERROR: Network request failed to return a response"
      );
    }

    if (!res.ok) {
      throw new Error(`NASA_SDK_ERROR: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  // -------------------------
  // Typed request helpers
  // -------------------------
  private async requestSingle(
    params: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<ApodResponse> {
    const data = await this.fetchRaw(params, signal);
    return ApodSchema.parse(data);
  }

  private async requestArray(
    params: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<ApodResponse[]> {
    const data = await this.fetchRaw(params, signal);
    return ApodArraySchema.parse(data);
  }

  // -------------------------
  // Public API
  // -------------------------
  async getApod(
    date?: string,
    signal?: AbortSignal
  ): Promise<ApodResponse> {
    return withRetry(
      () => this.requestSingle(date ? { date } : {}, signal),
      this.retries,
      this.retryDelayMs,
      signal
    );
  }

  async getRandom(
    count = 1,
    signal?: AbortSignal
  ): Promise<ApodResponse[]> {
    return withRetry(
      () => this.requestArray({ count }, signal),
      this.retries,
      this.retryDelayMs,
      signal
    );
  }

  async getRange(
    startDate: string,
    endDate: string,
    signal?: AbortSignal
  ): Promise<ApodResponse[]> {
    return withRetry(
      () =>
        this.requestArray(
          { start_date: startDate, end_date: endDate },
          signal
        ),
      this.retries,
      this.retryDelayMs,
      signal
    );
  }
}
