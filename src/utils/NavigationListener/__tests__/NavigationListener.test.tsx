import React from 'react';
import {
  vi, beforeEach, describe, test, expect,
} from 'vitest';
import { render } from '#shared/utils/testUtils';

import { useNavigate } from 'react-router';

import NavigationListener from '../index';

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}));

describe('NavigationListener', () => {
  beforeEach(() => {
    vi.mocked(useNavigate).mockReset();
  });

  test('calls navigate when reactRouterNavigate event is dispatched', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(<NavigationListener />);

    const event = new CustomEvent('reactRouterNavigate', {
      detail: { to: '/next', options: { replace: true } },
    });
    window.dispatchEvent(event);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/next', { replace: true });
  });

  test('removes event listener on unmount', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const { unmount } = render(<NavigationListener />);
    unmount();

    const event = new CustomEvent('reactRouterNavigate', {
      detail: { to: '/after-unmount', options: undefined },
    });
    window.dispatchEvent(event);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
