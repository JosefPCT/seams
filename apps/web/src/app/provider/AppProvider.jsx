// Main jsx file to handle all top-level providers (i.e QuueryProvider, AuthProvider, etc..)
import { QueryProvider } from "./QueryProvider";

export function AppProvider({ children }) {
  return (
    <QueryProvider>
        {children}
    </QueryProvider>
  )
}
