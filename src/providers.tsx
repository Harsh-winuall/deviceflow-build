// app/providers.tsx   (or wherever your Providers live)
"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import GlobalError from "./app/global-error";
import "./app/globals.css";
import StyledJsxRegistry from "./app/registry";
import store from "./app/store/store";
import { Toaster } from "./components/ui/sonner";
import { AlertProvider } from "./hooks/useAlert";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);

  const [queryClient] = useState(() => {
    return new QueryClient({
      // 1) Global onError for *all* queries
      queryCache: new QueryCache({
        onError: (error) => {
          const status = (error as any)?.response?.status;
          // show maintenance on any 5xx
          if (status && `${status}`.startsWith("5")) {
            setMaintenance(true);
          }
        },
      }),
    });
  });

  // 3) If a 5xx is tripped anywhere, short‑circuit to Maintenance
  if (maintenance) {
    return <GlobalError />;
  }

  // 4) Otherwise render your app
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <SessionProvider
          refetchOnWindowFocus={false}
          refetchWhenOffline={false}
          refetchInterval={1500}
        >
          <StyledJsxRegistry>
            <AlertProvider>
              <GoogleOAuthProvider clientId="412478416030-gf7v408b3i0nmh8hrtl1850g1ojk02u9.apps.googleusercontent.com">
                {children}
                <Toaster position="top-center" duration={3000} />
                <ReactQueryDevtools initialIsOpen={false} />
              </GoogleOAuthProvider>
            </AlertProvider>
          </StyledJsxRegistry>
        </SessionProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
