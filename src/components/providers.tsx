"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { createIDBPersister } from "@/lib/idbPersister"
import { useState } from "react"

export function Providers({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 24, // 24 hours
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    });

    return client;
  });

  React.useEffect(() => {
    const persister = createIDBPersister();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    persistQueryClient({
      queryClient,
      persister,
    });
  }, [queryClient])

  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}

