"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/store";
import { ThemeProvider } from "@/ds/theme-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  )
}

