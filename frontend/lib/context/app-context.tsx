/**
 * App Context
 * Task: 1.1.1.12g
 * Reference: State Management UI Patterns
 * 
 * React Context for client-side state (auth, theme, UI preferences)
 */

'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
