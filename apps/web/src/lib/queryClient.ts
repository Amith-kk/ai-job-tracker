import { QueryClient } from "@tanstack/react-query"

// ─── React Query Client ───────────────────────────────────
// Global configuration for all API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // data stays fresh for 5 minutes
      retry: 1,                      // retry failed requests once
      refetchOnWindowFocus: false,   // don't refetch when tab gets focus
    },
    mutations: {
      retry: 0,                      // don't retry failed mutations
    }
  }
})

export default queryClient