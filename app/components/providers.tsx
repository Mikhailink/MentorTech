"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <SessionProvider><QueryClientProvider client={client}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>{children}</ThemeProvider>
  </QueryClientProvider></SessionProvider>;
}