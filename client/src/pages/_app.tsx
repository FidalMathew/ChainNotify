import Provider from "@/Provider";
import "@/styles/globals.css";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {StarknetWalletConnectors} from "@dynamic-labs/starknet";
import {DynamicContextProvider} from "@dynamic-labs/sdk-react-core";
import type {AppProps} from "next/app";
import {useEffect, useState} from "react";
import {EthersExtension} from "@dynamic-labs/ethers-v5";

export default function App({Component, pageProps}: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
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
          walletConnectorExtensions: [EthersExtension],
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
