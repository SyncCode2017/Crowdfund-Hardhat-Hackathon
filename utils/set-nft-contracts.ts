import { ethers, getNamedAccounts } from "hardhat";
import { TIERS } from "./constants";
import { FundABusiness as FundABusinessType } from "../types";
import { ContractTransaction } from "ethers";

const setNftContracts = async (
  nftContractAddresses: string[]
): Promise<void> => {
  const { deployer } = await getNamedAccounts();
  try {
    const fundABiz: FundABusinessType = await ethers.getContract(
      "FundABusiness"
    );

    console.log("Setting NFT contracts addresses...");
    if (nftContractAddresses.length == 0) {
      throw new Error("No NFT contract address");
      process.exit(1);
    }

    /** TIERS_AND_NFT_CONTRACT = [
        [TIER1, "NFT_TIER1_ADDRESS"],
        [TIER2, "NFT_TIER2_ADDRESS"],
        [TIER3, "NFT_TIER3_ADDRESS"],
    ] */
    let TIERS_AND_NFT_CONTRACTS: [number, string][] = [];
    for (let i = 0; i < nftContractAddresses.length; i++) {
      TIERS_AND_NFT_CONTRACTS.push([TIERS[i], nftContractAddresses[i]]);
    }

    // Set NFT Contracts
    const tx: ContractTransaction = await fundABiz.setNftPerkContracts(
      TIERS_AND_NFT_CONTRACTS,
      { from: deployer }
    );
    await tx.wait();

    console.log("NFT contracts set!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default setNftContracts;
