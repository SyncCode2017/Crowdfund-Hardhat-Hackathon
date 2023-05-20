import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import {
  DECIMALS,
  INITIAL_PRICE,
  developmentChains,
  TIERS_MAX_SUPPLIES,
  TIERS_NAMES,
  nftMockContracts,
  nftMockAddresses,
} from "../utils/constants";
import { getBlockConfirmations } from "../utils/helper-functions";

const deployMockTokens: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, treasury_account, alice, bob, charlie, dave, erin } =
    await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    log("Deploying mocks...");
    const waitBlockConfirmations: number = getBlockConfirmations(
      developmentChains,
      network
    );

    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
      waitConfirmations: waitBlockConfirmations,
    });

    log("Mocks V3 Aggregator Deployed!");
    log("---------------------------------------------------------");

    for (let i = 0; i < TIERS_NAMES.length; i++) {
      if (TIERS_NAMES.length != TIERS_MAX_SUPPLIES.length) {
        throw new Error("invalid arrays lengths");
        process.exit(1);
      }
      const argsNFT: [string, string, number] = [
        treasury_account,
        TIERS_NAMES[i],
        TIERS_MAX_SUPPLIES[i],
      ];

      await nftMockContracts.push(
        await deploy("BasicNft", {
          from: deployer,
          args: argsNFT,
          log: true,
          waitConfirmations: waitBlockConfirmations,
        })
      );
      nftMockAddresses.push(nftMockContracts[i].address);
      log(`Mock NFT ${TIERS_NAMES[i]} Contracts Deployed!`);
      log("---------------------------------------------------------");
    }
  }
};

export default deployMockTokens;
deployMockTokens.tags = ["all", "mocks"];
