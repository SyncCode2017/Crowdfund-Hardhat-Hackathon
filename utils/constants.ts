import { ethers } from "ethers"
import { BigNumber } from "ethers"
import { Address } from "hardhat-deploy/dist/types"

// ############################ ALL VALUES BELOW NEED TO BE DECIDED FOR FINAL CONFIG ############################

// ------------------------ Other configs ------------------------
export const VERIFICATION_BLOCK_CONFIRMATIONS = 2 // CHANGE THIS TO 6 OR ABOVE FOR MAINNET
export const VERIFICATION_BLOCK_CONFIRMATIONS_DEV = 1
// export const improbableDeployWallet: Address = ""
export const developmentChains: Array<string> = ["hardhat", "localhost"]
// export const MINTER_ROLE: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"))
// export const BURNER_ROLE: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURNER_ROLE"))
// export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"
// export const BASE_URI_OBJECTS = "[METADATA_URI]/1"
// export const BASE_URI_RESOURCES = "[METADATA_URI]/2"

// export const ONE: BigNumber = ethers.utils.parseUnits("1", 18)
// export const ERC20_AMOUNT: string = ONE.mul(10000000).toString()
// export const MARKETPLACE_FEE = 250
// export const RESOURCE_ID = 1

export const BUSINESS_ADDRESS: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BUSINESS_ADDRESS"))
export const TREASURY_ADDRESS: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TREASURY_ADDRESS"))
export const CAMPAIGN_PERIOD = [1677909600, 1680501600]

export const FUNDER_TIERS_AND_COST: number[][] =  [
    [1, 50],
    [2, 100],
    [3, 300],
]

export const MILESTONE_SCHEDULE: number[][] =  [
    [CAMPAIGN_PERIOD[1], 20000],
    [(CAMPAIGN_PERIOD[1] + (30*24*60*60)), 50000],
    [(CAMPAIGN_PERIOD[1] + (30*24*60*60)), 80000],
    [(CAMPAIGN_PERIOD[1] + (30*24*60*60)), 100000],
]
/**[
    [END_TIME, 0.2*100000],
    [END_TIME + 30days, 0.5*100000],
    [END_TIME + 60days, 0.8*100000],
    [END_TIME + 90days, 1*100000],
] */

export const TIERS_AND_NFT_CONTRACT: [number, string][] =  [
    [1, "NFT_TIER1"],
    [2, "NFT_TIER2"],
    [3, "NFT_TIER3"],
]