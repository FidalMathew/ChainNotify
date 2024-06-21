import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  starknet: {
    dockerizedVersion: "0.10.3",
    network: "alpha-goerli"
  },
  networks: {
  }
};

export default config;
