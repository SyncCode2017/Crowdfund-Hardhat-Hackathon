import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
// import { Address, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import {
  ONE,
  ERC20_AMOUNT,
  developmentChains,
  TIERS_MAX_SUPPLIES,
  TIERS_NAMES,
  nftTiersContracts,
  nftTiersAddresses,
} from "../utils/constants";
import { getBlockConfirmations } from "../utils/helper-functions";
import { MockERC20 as MockERC20Type, BasicNft as BasicNftType } from "../types";

const deployMockTokens: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const {
    deployer,
    business_account,
    treasury_account,
    alice,
    bob,
    charlie,
    dave,
    erin,
  } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...");

    const waitBlockConfirmations: number = getBlockConfirmations(
      developmentChains,
      network
    );

    const accounts = await ethers.getSigners();
    const argsErc20: [string[], BigNumber[]] = [
      [alice, bob, charlie, dave, erin],
      [ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT],
    ];

    const mockErc20: DeployResult = await deploy("MockERC20", {
      from: deployer,
      args: argsErc20,
      log: true,
      waitConfirmations: waitBlockConfirmations,
    });

    log("Mock ERC-20 Deployed!");
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

      nftTiersContracts.push(
        await deploy("BasicNft", {
          from: deployer,
          args: argsNFT,
          log: true,
          waitConfirmations: waitBlockConfirmations,
        })
      );
      nftTiersAddresses.push(nftTiersContracts[i].address);
      log(`Mock NFT ${TIERS_NAMES[i]} Contracts Deployed!`);
      log("---------------------------------------------------------");
    }
  }
};

export default deployMockTokens;
deployMockTokens.tags = ["all", "mocks"];
