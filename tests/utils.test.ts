import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../src/utils';

describe('withRetry', () => {
 it('retries failed function and succeeds', async () => {
  vi.useFakeTimers();
  const fn = vi.fn()
    .mockRejectedValueOnce(new Error('Fail'))
    .mockResolvedValue(42);

  const promise = withRetry(fn, 2, 1000);
  await vi.advanceTimersByTimeAsync(1000);
  
  const result = await promise;
  expect(result).toBe(42);
  vi.useRealTimers();
});

  it('fails after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(withRetry(fn, 3, 0)).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(4);
  });
});
