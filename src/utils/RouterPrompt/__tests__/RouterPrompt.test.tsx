import React from 'react';
import {
  vi, beforeEach, describe, test, expect,
} from 'vitest';
import {
  render, screen, fireEvent, waitFor,
} from '#shared/utils/testUtils';

import RouterPrompt from '../RouterPrompt';

const mocks = vi.hoisted(() => {
  return {
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
    lastBlocker: null as { cb: any; blocker: { proceed: any } } | null,
    setLastBlocker: (blocker: { cb: any; blocker: { proceed: any } } | null) => {
      mocks.lastBlocker = blocker;
    },
    getLastBlocker: () => mocks.lastBlocker,
  };
});

vi.mock('react-router', () => ({
  useLocation: mocks.useLocation,
  useNavigate: mocks.useNavigate,
  useBlocker: (cb: any) => {
    const blocker = { proceed: vi.fn() };
    mocks.setLastBlocker({ cb, blocker });
    return blocker;
  },
}));

vi.mock('#web-components/components/ConfirmModal', () => ({
  default: ({
    title, isOpen, onSubmit, onOpenChange, submitText, cancelText,
  }: any) => {
    if (!isOpen) { return null; }
    return (
      <div>
        <div>{title}</div>
        <button data-xpath="confirm" type="button" onClick={onSubmit}>{submitText}</button>
        <button data-xpath="cancel" type="button" onClick={() => onOpenChange(false)}>{cancelText}</button>
      </div>
    );
  },
}));

describe('RouterPrompt', () => {
  beforeEach(() => {
    mocks.useLocation.mockReset();
    mocks.useNavigate.mockReset();
  });

  test('confirm proceeds and navigates to provided next location', async () => {
    const mockNavigate = vi.fn();
    mocks.useNavigate.mockReturnValue(mockNavigate);
    mocks.useLocation.mockReturnValue({ pathname: '/', search: '' } as any);

    render(<RouterPrompt title="T" okText="OK" cancelText="C" enabled text="x" baseName="" />);

    const last = mocks.getLastBlocker();
    last?.cb({ nextLocation: { pathname: '/next', search: '?a=1', state: undefined } });

    await screen.findByTestId('confirm');

    fireEvent.click(screen.getByTestId('confirm'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/next?a=1');
    });
  });

  test('back button branch sets shouldGoBack and navigate(-1) on confirm', async () => {
    const mockNavigate = vi.fn();
    mocks.useNavigate.mockReturnValue(mockNavigate);
    mocks.useLocation.mockReturnValue({ pathname: '/from', search: '' } as any);
    window.history.pushState({}, '', '/other');

    render(<RouterPrompt title="Back" okText="OK" cancelText="C" enabled text="y" baseName="" />);

    const last = mocks.getLastBlocker();
    last?.cb({ nextLocation: { pathname: '/next', search: '', state: undefined } });

    await screen.findByTestId('confirm');

    fireEvent.click(screen.getByTestId('confirm'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  test('cancel closes the modal without navigating', async () => {
    const mockNavigate = vi.fn();
    mocks.useNavigate.mockReturnValue(mockNavigate);
    mocks.useLocation.mockReturnValue({ pathname: '/', search: '' } as any);

    render(<RouterPrompt title="Cancel" okText="OK" cancelText="C" enabled text="z" baseName="" />);

    const last = mocks.getLastBlocker();
    last?.cb({ nextLocation: { pathname: '/will-cancel', search: '', state: undefined } });

    await screen.findByTestId('confirm');

    fireEvent.click(screen.getByTestId('cancel'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm')).toBeNull();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
