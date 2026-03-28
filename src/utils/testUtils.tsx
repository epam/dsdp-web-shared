import React, { type ReactElement, Suspense } from 'react';
import { configure, render, type RenderOptions } from '@testing-library/react';
import { createTheme as createMuiTheme, ThemeProvider } from '@material-ui/core';
import type { PaletteOptions } from '@material-ui/core/styles/createPalette';
import type { vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { OSDefaultLight } from '#web-components/styles';

const theme = createMuiTheme({
  palette: {} as PaletteOptions,
});

interface Options extends Omit<RenderOptions, 'wrapper'> {
  dispatchMock?: ReturnType<typeof vi.mocked>;
  preloadedState?: Record<string, unknown>;
  locationSettings?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any;
}

function ThemeProviderWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider theme={{
      ...theme,
      colors: OSDefaultLight.colors,
      borders: OSDefaultLight.borders,
      flags: OSDefaultLight.flags,
      typography: { ...theme.typography, ...OSDefaultLight.typography },
      shadow: OSDefaultLight.shadow,
    }}
    >
      {children}
    </ThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  configure({ testIdAttribute: 'data-xpath' });
  return render(ui, { wrapper: ThemeProviderWrapper, ...options });
};

const customRenderViaProvider = (
  ui: ReactElement,
  {
    preloadedState,
    store = configureStore({ reducer: () => preloadedState, preloadedState }),
    dispatchMock,
    locationSettings,
    ...renderOptions
  }: Options = {},
) => {
  function AllTheProviders({ children }: Readonly<{ children: React.ReactNode }>) {
    if (dispatchMock) {
      // eslint-disable-next-line no-param-reassign
      store.dispatch = dispatchMock;
    }
    const router = createMemoryRouter(
      // If routes are provided, use them
      [
        {
          path: '*',
          element: children,
        },
      ],
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialEntries: locationSettings && [locationSettings] as any,
        initialIndex: 0,
      },
    );

    return (
      <Suspense fallback={<div />}>
        <Provider store={store}>
          <ThemeProvider theme={{
            ...theme,
            colors: OSDefaultLight.colors,
            borders: OSDefaultLight.borders,
            shadow: OSDefaultLight.shadow,
            flags: OSDefaultLight.flags,
            typography: { ...theme.typography, ...OSDefaultLight.typography },
          }}
          >
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </Suspense>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
export { customRenderViaProvider as portalRender };
