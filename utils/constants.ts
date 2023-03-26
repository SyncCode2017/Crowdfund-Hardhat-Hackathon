import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Address } from "hardhat-deploy/dist/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";

// ############################ ALL VALUES BELOW NEED TO BE DECIDED FOR FINAL CONFIG ############################

// ------------------------ Other configs ------------------------
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6; // CHANGE THIS TO 6 OR ABOVE FOR MAINNET
export const VERIFICATION_BLOCK_CONFIRMATIONS_DEV = 1;
// export const improbableDeployWallet: Address = ""
export const developmentChains: Array<string> = ["hardhat", "localhost"];
// export const MINTER_ROLE: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"))
// export const BURNER_ROLE: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURNER_ROLE"))
// export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"
// export const BASE_URI_OBJECTS = "[METADATA_URI]/1"
// export const BASE_URI_RESOURCES = "[METADATA_URI]/2"

export const ONE: BigNumber = ethers.utils.parseUnits("1", 18);
export const ERC20_AMOUNT: BigNumber = ONE.mul(10000);
export const TIERS_NAMES: string[] = ["TIER1", "TIER2", "TIER3"];
export const TIERS_MAX_SUPPLIES = [100, 100, 100];
export const AMOUNTS_TO_BE_RAISED = [ONE.mul(1000), ONE.mul(10000)];
export const TIERS = [1, 2, 3];
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
// export const BUSINESS_ADDRESS = async (): Promise<string> => {
//   const accounts = await ethers.getSigners();
//   return accounts[1].address;
// };

// export const TREASURY_ADDRESS = async (): Promise<string> => {
//   const accounts = await ethers.getSigners();
//   return accounts[2].address;
// };

// export const RESOURCE_ID = 1

// export const BUSINESS_ADDRESS: string = ethers.utils.keccak256(
//   ethers.utils.toUtf8Bytes("BUSINESS_ADDRESS")
// );
// export const TREASURY_ADDRESS: string = ethers.utils.keccak256(
//   ethers.utils.toUtf8Bytes("TREASURY_ADDRESS")
// );

export const CAMPAIGN_PERIOD: number[] = [1710656430, 1718601630, 10000]; // [unix start time, unix end time, time (in seconds) required to make a decision]

export const TIER1_PRICE: BigNumber = ONE.mul(100);
export const TIER2_PRICE: BigNumber = ONE.mul(200);
export const TIER3_PRICE: BigNumber = ONE.mul(300);

/** FUNDERS_TIERS_AND_COST = [
  [TIER1, 50 USD],
  [TIER2, 100 USD],
  [TIER3, 200 USD],
] */
export const FUNDERS_TIERS_AND_COST: [number, BigNumber][] = [
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
export const nftTiersContracts: DeployResult[] = [];
export const nftTiersAddresses: Address[] = [];

export const CROWDDIT_FEE_FRACTION = 10000; // 10% => 0.1*100000 = 10000
