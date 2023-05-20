import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { DeployResult } from "hardhat-deploy/types";

// ############################ ALL VALUES BELOW NEED TO BE DECIDED FOR FINAL CONFIG ############################

export const VERIFICATION_BLOCK_CONFIRMATIONS = 6; // CHANGE THIS TO 6 OR ABOVE FOR MAINNET
export const VERIFICATION_BLOCK_CONFIRMATIONS_DEV = 1;
export const developmentChains: Array<string> = ["hardhat", "localhost"];
export const imagesLocation = "./images/";
export const MOAT_WALLETS: Array<string> = [
  process.env.MOAT_WALLET1!,
  process.env.MOAT_WALLET2!,
  process.env.MOAT_WALLET3!,
  process.env.MOAT_WALLET4!,
  process.env.MOAT_WALLET5!,
];

// ------------------------ FundABusiness configs ------------------------
export const ONE: BigNumber = ethers.utils.parseUnits("1", 18);
export const DECIMALS = "8";
export const ERC20_AMOUNT = ONE.mul(10000);
export const INITIAL_PRICE = "200000000000"; // 2000
export const TIERS_NAMES: string[] = ["TIER1", "TIER2", "TIER3"];
export const TIERS_SYMBOLS: string[] = ["TIER1", "TIER2", "TIER3"];
export const AMOUNTS_TO_BE_RAISED = [ONE.mul(3), ONE.mul(5)];
export const TIERS = [1, 2, 3];
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// For unit test
// [unix start time, unix end time, time (in seconds) required to make a decision]
export const CAMPAIGN_PERIOD: number[] = [1710656430, 1718601630, 10000];

// For running localhost for front-end
// export const CAMPAIGN_PERIOD: number[] = [1683477930, 1718601630, 79200];

export const TIER1_PRICE: number = 100; //ONE.mul(100);
export const TIER2_PRICE: number = 200; //ONE.mul(200);
export const TIER3_PRICE: number = 300; //ONE.mul(300);
export const sumOfTiersPrices = 100 + 200 + 300;

/** FUNDERS_TIERS_AND_COST = [
  [TIER1, 50 USD],
  [TIER2, 100 USD],
  [TIER3, 200 USD],
] */
export const FUNDERS_TIERS_AND_COST: [number, number][] = [
  [TIERS[0], TIER1_PRICE],
  [TIERS[1], TIER2_PRICE],
  [TIERS[2], TIER3_PRICE],
];

/** MILESTONE_SCHEDULE = [
    [0, 0.2*100000],
    [milestone1, 0.3*100000],
    [milestone2, 0.4*100000],
    [milestone3, 0.1*100000],
] */
export const MILESTONE_SCHEDULE: number[][] = [
  [0, 20000],
  [1, 30000],
  [2, 40000],
  [3, 10000],
];
export const MOAT_FEE_NUMERATOR = 10000; // 10% => 0.1*100000 = 10000
export const TARGETMET = 0;
export const FAILURE = 1;
// ------------------------ NFT Perks configs ------------------------
export const nftMockContracts: DeployResult[] = [];
export const nftMockAddresses: Address[] = [];
export const nftPerksContracts: DeployResult[] = [];
export const nftPerksAddresses: Address[] = [];
export const TIERS_MAX_SUPPLIES = [100, 100, 100];
export const TOKEN_URIS = [
  "ipfs://bafkreic6ygsgs2g56js34sgkdssqlsnmx5zxu7ppvpxwism5dju3i77qdy",
  "ipfs://bafkreihmipci7djt4yuyzcre7xfsflmrzmc4rp7zbxd2eklz7sm4hfnw2y",
  "ipfs://bafkreic4o5gifgknioonzvddr46wtgvrkubxub42idoeruyhlazlabnfvq",
];
export const ROYALTY_FEE = 2500;
export const discount_array = [10, 20, 30];
export const access_array = ["vip1", "vip2", "vip3"];

export const frontEndContractsFile = [
  "../front-end-nextjs/constants/fundABizAddress.json",
  "../front-end-nextjs/constants/nftPerksAddresses.json",
];
export const frontEndAbiLocation = "../front-end-nextjs/constants/";
