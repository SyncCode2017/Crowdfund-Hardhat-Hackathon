import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import {
  ERC20_AMOUNT,
  developmentChains,
  TIERS_MAX_SUPPLIES,
  TIERS_NAMES,
  nftMockContracts,
  nftMockAddresses,
  CROWDDIT_WALLETS,
} from "../utils/constants";
import { getBlockConfirmations, verify } from "../utils/helper-functions";

const deployMockTokens: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, treasury_account, alice, bob, charlie, dave, erin } =
    await getNamedAccounts();
  const chainId = network.config.chainId;

  log("Deploying mocks...");
  const waitBlockConfirmations: number = getBlockConfirmations(
    developmentChains,
    network
  );
  let argsErc20: [string[], BigNumber[]] = [[], []];

  if (!developmentChains.includes(network.name)) {
    argsErc20 = [
      CROWDDIT_WALLETS,
      [ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT],
    ];
  } else {
    argsErc20 = [
      [alice, bob, charlie, dave, erin],
      [ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT, ERC20_AMOUNT],
    ];
  }
  const mockErc20: DeployResult = await deploy("MockERC20", {
    from: deployer,
    args: argsErc20,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  log("Mock ERC-20 Deployed!");
  log("---------------------------------------------------------");

  // Verify the contracts
  if (
    !developmentChains.includes(network.name) &&
    process.env.POLYGONSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(mockErc20.address, argsErc20);
  }

  if (developmentChains.includes(network.name)) {
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
