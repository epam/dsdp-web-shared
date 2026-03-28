import {
  describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';

describe('ensureRouterBaseName', () => {
  const originalLocation = window.location;
  const originalHistory = window.history;
  let replaceStateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replaceStateSpy = vi.fn();

    delete (globalThis as any).location;
    delete (globalThis as any).history;

    globalThis.history = {
      ...originalHistory,
      replaceState: replaceStateSpy,
    };

    // Reset module cache to ensure the module is re-executed for each test
    vi.resetModules();
  });

  afterEach(() => {
    globalThis.location = originalLocation;
    globalThis.history = originalHistory;
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should add BASE_URL to pathname when pathname does not include BASE_URL', async () => {
    const baseUrl = '/my-app/';
    const pathname = '/dashboard';

    globalThis.location = {
      ...originalLocation,
      pathname,
    } as any;

    vi.stubEnv('BASE_URL', baseUrl);

    await import('../ensureRouterBaseName');

    expect(replaceStateSpy).toHaveBeenCalledWith('', '', '/my-app//dashboard');
  });

  it('should not modify pathname when it already includes BASE_URL', async () => {
    const baseUrl = '/my-app/';
    const pathname = '/my-app/dashboard';

    globalThis.location = {
      ...originalLocation,
      pathname,
    } as any;

    vi.stubEnv('BASE_URL', baseUrl);

    await import('../ensureRouterBaseName');

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('should handle empty BASE_URL', async () => {
    const baseUrl = '';
    const pathname = '/dashboard';

    globalThis.location = {
      ...originalLocation,
      pathname,
    } as Location;

    vi.stubEnv('BASE_URL', baseUrl);

    await import('../ensureRouterBaseName');

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('should handle root pathname', async () => {
    const baseUrl = '/my-app/';
    const pathname = '/';

    globalThis.location = {
      ...originalLocation,
      pathname,
    } as any;

    vi.stubEnv('BASE_URL', baseUrl);

    await import('../ensureRouterBaseName');

    expect(replaceStateSpy).toHaveBeenCalledWith('', '', '/my-app//');
  });

  it('should handle BASE_URL without trailing slash', async () => {
    const baseUrl = '/my-app';
    const pathname = '/dashboard';

    globalThis.location = {
      ...originalLocation,
      pathname,
    } as any;

    vi.stubEnv('BASE_URL', baseUrl);

    await import('../ensureRouterBaseName');

    expect(replaceStateSpy).toHaveBeenCalledWith('', '', '/my-app/dashboard');
  });

  it('should handle pathname with query parameters', async () => {
    const baseUrl = '/my-app/';
    const pathname = '/dashboard?param=value';

    globalThis.location = {
      ...originalLocation,
      pathname,
    } as any;

    vi.stubEnv('BASE_URL', baseUrl);

    await import('../ensureRouterBaseName');

    expect(replaceStateSpy).toHaveBeenCalledWith('', '', '/my-app//dashboard?param=value');
  });
});
