import { ethers, getNamedAccounts } from "hardhat";
import { nftTiersAddresses, TIERS } from "../utils/constants";
import { FundABusiness as FundABusinessType } from "../types";
import { ContractTransaction } from "ethers";

const setNftContracts = async (): Promise<void> => {
  const { deployer } = await getNamedAccounts();
  try {
    const fundABiz: FundABusinessType = await ethers.getContract(
      "FundABusiness"
    );

    console.log("Setting NFT contracts addresses...");
    if (nftTiersAddresses.length == 0) {
      throw new Error("No NFT contract address");
      process.exit(1);
    }

    /** TIERS_AND_NFT_CONTRACT = [
        [TIER1, "NFT_TIER1_ADDRESS"],
        [TIER2, "NFT_TIER2_ADDRESS"],
        [TIER3, "NFT_TIER3_ADDRESS"],
    ] */
    const TIERS_AND_NFT_CONTRACTS: [number, string][] = [
      [TIERS[0], nftTiersAddresses[0]],
      [TIERS[1], nftTiersAddresses[1]],
      [TIERS[2], nftTiersAddresses[2]],
    ];
    // Set NFT Contracts
    const tx: ContractTransaction = await fundABiz.setNftPerkContracts(
      TIERS_AND_NFT_CONTRACTS,
      { from: deployer }
    );
    await tx.wait();

    console.log("NFT Tiers contracts set!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default setNftContracts;
setNftContracts.tags = ["setNFT"];
