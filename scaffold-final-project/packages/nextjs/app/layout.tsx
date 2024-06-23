import type {Metadata} from "next";
import {ScaffoldStarkAppWithProviders} from "~~/components/ScaffoldStarkAppWithProviders";
import "~~/styles/globals.css";
import {ThemeProvider} from "~~/components/ThemeProvider";
import {DynamicContextProvider} from "@dynamic-labs/sdk-react-core";
import {EthersExtension} from "@dynamic-labs/ethers-v5";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {StarknetWalletConnectors} from "@dynamic-labs/starknet";

export const metadata: Metadata = {
  title: "Scaffold-Stark",
  description: "Fast track your starknet journey",
  icons: "/logo.ico",
};

const ScaffoldStarkApp = ({children}: {children: React.ReactNode}) => {
  const evmNetworks = [
    {
      blockExplorerUrls: ["https://etherscan.io/"],
      chainId: 1,
      chainName: "Sepolia",
      iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
      name: "Sepolia",
      nativeCurrency: {
        decimals: 18,
        name: "Sepolia Ether",
        symbol: "SETH",
      },
      networkId: 1,
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      vanityName: "Sepolia Mainnet",
    },
  ];

  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <DynamicContextProvider
            settings={{
              environmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID!,
              walletConnectorExtensions: [EthersExtension],
              // initialAuthenticationMode: "connect-only",
              walletConnectors: [
                // EthereumWalletConnectors,
                StarknetWalletConnectors,
              ],
            }}
          >
            <ScaffoldStarkAppWithProviders>
              {children}
            </ScaffoldStarkAppWithProviders>
          </DynamicContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
