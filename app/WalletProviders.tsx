'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { getConfig } from './wagmi'
import '@rainbow-me/rainbowkit/styles.css';
import "./globals.css"

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme
} from '@rainbow-me/rainbowkit';

// Custom theme options for light mode
const lightThemeCustom = lightTheme({
  accentColor: 'hsl(var(--primary))',
  accentColorForeground: 'hsl(var(--primary-foreground))',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Custom theme options for dark mode
const darkThemeCustom = darkTheme({
  accentColor: 'hsl(var(--primary-border))',
  accentColorForeground: 'hsl(var(--primary-foreground))',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Override specific colors for both themes
const customColors = {
  modalBackground: 'hsl(var(--card))',
  modalBorder: 'hsl(var(--border))',
  modalText: 'hsl(var(--foreground))',
  modalTextDim: 'hsl(var(--muted-foreground))',
  modalTextSecondary: 'hsl(var(--muted-foreground))',
  actionButtonBorder: 'hsl(var(--border))',
  actionButtonBorderMobile: 'hsl(var(--border))',
  actionButtonSecondaryBackground: 'hsl(var(--primary))',
  closeButton: 'hsl(var(--foreground))',
  closeButtonBackground: 'hsl(var(--muted))',
  connectButtonBackground: 'hsl(var(--primary))',
  connectButtonBackgroundError: 'hsl(var(--destructive))',
  connectButtonInnerBackground: 'hsl(var(--primary))',
  connectButtonText: 'hsl(var(--primary-foreground))',
  connectButtonTextError: 'hsl(var(--destructive-foreground))',
  profileAction: 'hsl(var(--primary))',
  profileActionHover: 'hsl(var(--accent))',
  selectedOptionBorder: 'hsl(var(--primary-border))',
};


// Create merged theme object with both light and dark modes
const myDynamicTheme = {
  lightMode: {
    ...lightThemeCustom,
    colors: {
      ...lightThemeCustom.colors,
      ...customColors,
    },
  },
  darkMode: {
    ...darkThemeCustom,
    colors: {
      ...darkThemeCustom.colors,
      ...customColors,
    },
  },
};

export function WalletProviders(props: {
  children: ReactNode
  initialState?: State
}) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myDynamicTheme}>
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
