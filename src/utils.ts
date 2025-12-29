// nasa-sdk/src/utils.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
  signal?: AbortSignal
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // CRITICAL: If aborted, do not retry! Just throw immediately.
    if (error.name === 'AbortError' || signal?.aborted) {
      throw error;
    }

    if (retries <= 0) throw error;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay, signal);
  }
}