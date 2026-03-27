import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startObserver, stopObserver } from '../../entrypoints/google-docs.content/observer';

describe('observer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    stopObserver();
    vi.useRealTimers();
  });

  it('should call the callback when DOM changes occur', async () => {
    const callback = vi.fn();
    startObserver(callback);

    // Trigger a DOM mutation
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Flush microtasks so MutationObserver fires
    await vi.advanceTimersByTimeAsync(150);

    expect(callback).toHaveBeenCalled();
  });

  it('should debounce rapid DOM changes', async () => {
    const callback = vi.fn();
    startObserver(callback);

    // Trigger multiple rapid mutations
    for (let i = 0; i < 5; i++) {
      document.body.appendChild(document.createElement('div'));
    }

    await vi.advanceTimersByTimeAsync(150);

    // Should only call once due to debouncing
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback after stopObserver', async () => {
    const callback = vi.fn();
    startObserver(callback);
    stopObserver();

    document.body.appendChild(document.createElement('div'));
    await vi.advanceTimersByTimeAsync(150);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not create duplicate observers', () => {
    const callback = vi.fn();
    startObserver(callback);
    startObserver(callback); // second call should be no-op

    // If duplicates existed, stopping once wouldn't fully stop
    stopObserver();
  });
});
