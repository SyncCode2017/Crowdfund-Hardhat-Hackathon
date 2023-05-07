import { ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  developmentChains,
  TIERS_MAX_SUPPLIES,
  TIERS_NAMES,
  nftPerksContracts,
  nftPerksAddresses,
  ROYALTY_FEE,
  TIERS_SYMBOLS,
  TOKEN_URIS,
  MOAT_WALLETS,
} from "../utils/constants";
import { getBlockConfirmations, verify } from "../utils/helper-functions";
import {
  NftPerks as NftPerksType,
  FundABusiness as FundABusinessType,
} from "../types";
import setNftContracts from "../utils/set-nft-contracts";

const deployNftPerks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, treasury_account } = await getNamedAccounts();
  let receiver: string;

  const waitBlockConfirmations: number = getBlockConfirmations(
    developmentChains,
    network
  );
  const fundABiz: FundABusinessType = await ethers.getContract("FundABusiness");

  if (developmentChains.includes(network.name)) {
    receiver = treasury_account;
  } else {
    receiver = MOAT_WALLETS[3];
  }

  log("Deploying NFT perks...");
  log("---------------------------------------------------------");

  for (let index in TIERS_NAMES) {
    if (TIERS_NAMES.length != TIERS_MAX_SUPPLIES.length) {
      throw new Error("invalid array lengths");
      process.exit(1);
    }
    const argsNFT: [string, string, number, string, string, number] = [
      TIERS_NAMES[index],
      TIERS_SYMBOLS[index],
      TIERS_MAX_SUPPLIES[index],
      receiver,
      TOKEN_URIS[index],
      ROYALTY_FEE,
    ];

    nftPerksContracts.push(
      await deploy("NftPerks", {
        from: deployer,
        args: argsNFT,
        log: true,
        waitConfirmations: waitBlockConfirmations,
      })
    );
    nftPerksAddresses.push(nftPerksContracts[index].address);
    log(`NFT Perks ${TIERS_NAMES[index]} Contract Deployed!`);
    log("---------------------------------------------------------");

    // Verify the contracts
    if (
      !developmentChains.includes(network.name) &&
      process.env.POLYGONSCAN_API_KEY
    ) {
      log("Verifying...");
      await verify(nftPerksAddresses[index], argsNFT);
    }
  }
  // Set up Minter role for the NFT Contracts
  const SET_NFT_PERKS = process.env.SET_NFT_PERKS!;
  if (SET_NFT_PERKS === "true") {
    log("-----------------------------------------------------------");
    log("Setting up NFT contracts for Minter role...");

    for (let index in nftPerksContracts) {
      const nftTierContract: NftPerksType = await ethers.getContractAt(
        "NftPerks",
        nftPerksAddresses[index],
        deployer
      );

      const minter = await nftTierContract.MINTER_ROLE();
      const adminRole = await nftTierContract.DEFAULT_ADMIN_ROLE();
      // Grant the FundABusiness Contract the minter role
      const tx1: ContractTransaction = await nftTierContract.grantRole(
        minter,
        fundABiz.address,
        { from: deployer }
      );
      await tx1.wait();
      // Revoke default admin role
      const revokeTx = await nftTierContract.revokeRole(adminRole, deployer, {
        from: deployer,
      });
      await revokeTx.wait();
      // Renounce deployer's minter role
      const renounceTx = await nftTierContract.renounceRole(minter, deployer, {
        from: deployer,
      });
      await renounceTx.wait();
      log(
        "Minter role granted to FundABusiness Contract and Default Admin Role revoked!"
      );
      // Set the NFT Perks Contracts to the FundABusiness Contract
      await setNftContracts(nftPerksAddresses);
    }
  }
};

export default deployNftPerks;
deployNftPerks.tags = ["all", "nftperks"];
