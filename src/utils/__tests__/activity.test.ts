import {
  describe, it, expect,
  vi, beforeEach, afterEach,
} from 'vitest';
import { ActivityHelper } from '../activity';

describe('ActivityHelper', () => {
  let cb: vi.Mock;
  let activityHelper: ActivityHelper;
  const events = ['click', 'keydown'] as Array<keyof DocumentEventMap>;
  const intervalDuration = 60 * 1000;

  beforeEach(() => {
    cb = vi.fn();
    activityHelper = new ActivityHelper(cb, events, intervalDuration);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with the correct properties', () => {
    expect(activityHelper.events).toEqual(events);
    expect(activityHelper.intervalDuration).toBe(intervalDuration);
  });

  it('should enable event listeners', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    activityHelper.enable();

    events.forEach((event) => {
      expect(addEventListenerSpy).toHaveBeenCalledWith(event, expect.any(Function), { passive: true });
    });

    addEventListenerSpy.mockRestore();
  });

  it('should disable event listeners', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    activityHelper.enable();
    activityHelper.disable();

    events.forEach((event) => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith(event, expect.any(Function));
    });

    removeEventListenerSpy.mockRestore();
  });

  it('should throttle the callback function', () => {
    vi.useFakeTimers();

    activityHelper.enable();
    document.dispatchEvent(new Event('click'));
    document.dispatchEvent(new Event('click'));

    vi.advanceTimersByTime(intervalDuration);

    expect(cb).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
