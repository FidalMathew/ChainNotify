import Provider from "@/Provider";
import "@/styles/globals.css";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {StarknetWalletConnectors} from "@dynamic-labs/starknet";
import {DynamicContextProvider} from "@dynamic-labs/sdk-react-core";
import type {AppProps} from "next/app";

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID!,
          initialAuthenticationMode: "connect-only",
          walletConnectors: [
            EthereumWalletConnectors,
            StarknetWalletConnectors,
          ],
          bridgeChains: [
            {
              chain: "EVM",
            },
            {
              chain: "STARK",
            },
          ],
        }}
      >
        <Component {...pageProps} />
      </DynamicContextProvider>
    </Provider>
  );
}
