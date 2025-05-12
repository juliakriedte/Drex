import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  networks: {
    besu: {
      url: "http://localhost:8545",
      accounts: ["4c0883a69102937d6231471b5dbb62f5b8de44a9ab2f61d01c3e8a91f709ea68"]
    }
  }
};

export default config;
