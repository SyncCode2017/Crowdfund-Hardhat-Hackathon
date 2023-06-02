import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { DECIMALS, INITIAL_PRICE, developmentChains } from "../utils/constants";
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
  }
};

export default deployMockTokens;
deployMockTokens.tags = ["all", "mocks"];
