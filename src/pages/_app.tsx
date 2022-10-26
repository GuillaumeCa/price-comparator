import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "../components/AuthProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
          <Analytics />
        </Hydrate>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default MyApp;
