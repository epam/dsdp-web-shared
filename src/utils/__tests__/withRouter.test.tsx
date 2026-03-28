import React from 'react';
import {
  vi, beforeEach, describe, test, expect,
} from 'vitest';
import { useLocation, useNavigate, useParams } from 'react-router';
import { render, screen, fireEvent } from '#shared/utils/testUtils';

import { withRouter, type RouterProps } from '../withRouter';

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

describe('withRouter', () => {
  beforeEach(() => {
    vi.mocked(useLocation).mockReset();
    vi.mocked(useNavigate).mockReset();
    vi.mocked(useParams).mockReset();
  });

  test('injects router props (location, params) and forwards other props', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test-path', search: '', hash: '', state: null, key: 'abc',
    });
    vi.mocked(useParams).mockReturnValue({ id: '123' });
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const Dummy: React.FC<{ router: RouterProps; label?: string }> = ({ router, label }) => (
      <div>
        <div data-xpath="path">{router.location.pathname}</div>
        <div data-xpath="param">{(router.params as Record<string, string>).id}</div>
        <div data-xpath="label">{label}</div>
      </div>
    );

    const Wrapped = withRouter(Dummy);
    render(<Wrapped label="hello" />);

    expect(screen.getByTestId('path').textContent).toBe('/test-path');
    expect(screen.getByTestId('param').textContent).toBe('123');
    expect(screen.getByTestId('label').textContent).toBe('hello');
  });

  test('exposes navigate function and it can be called by wrapped component', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/another', search: '', hash: '', state: null, key: 'def',
    });
    vi.mocked(useParams).mockReturnValue({});
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const DummyNav: React.FC<{ router: RouterProps }> = ({ router }) => (
      <div>
        <button
          type="button"
          data-xpath="nav-button"
          onClick={() => router.navigate('/next', { replace: true })}
        >
          go
        </button>
      </div>
    );

    const WrappedNav = withRouter(DummyNav);
    render(<WrappedNav />);

    fireEvent.click(screen.getByTestId('nav-button'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/next', { replace: true });
  });

  test('works when params are empty and navigate is a no-op function', () => {
    // Extra case: ensure no crash when params empty and navigate exists
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/', search: '', hash: '', state: null, key: 'root',
    });
    vi.mocked(useParams).mockReturnValue({});
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const DummySimple: React.FC<{ router: RouterProps }> = ({ router }) => (
      <div>{router.location.pathname}</div>
    );

    const WrappedSimple = withRouter(DummySimple);
    render(<WrappedSimple />);
    expect(screen.getByText('/')).toBeTruthy();
  });
});
