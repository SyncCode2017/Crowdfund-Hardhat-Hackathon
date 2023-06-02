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

  log("-----------------------------------------------------------");
};

export default deployNftPerks;
deployNftPerks.tags = ["all", "nftperks"];
