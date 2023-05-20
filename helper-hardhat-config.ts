export interface networkConfigItem {
  ethUsdPriceFeed?: string;
  maticUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  mainnet: {
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    blockConfirmations: 6,
  },
  goerli: {
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    blockConfirmations: 6,
  },
  polygonMumbai: {
    maticUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    blockConfirmations: 6,
  },
  polygonMainnet: {
    maticUsdPriceFeed: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    blockConfirmations: 6,
  },
};

export const developmentChains = ["hardhat", "localhost"];
