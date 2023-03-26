import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import {
  ONE,
  ERC20_AMOUNT,
  developmentChains,
  nftTiersContracts,
  CROWDDIT_FEE_FRACTION,
  AMOUNTS_TO_BE_RAISED,
  CAMPAIGN_PERIOD,
  FUNDERS_TIERS_AND_COST,
  MILESTONE_SCHEDULE,
  nftTiersAddresses,
} from "../utils/constants";
import { getBlockConfirmations } from "../utils/helper-functions";
import {
  FundABusiness as FundABusinessType,
  BasicNft as BasicNftType,
  MockERC20 as MockERC20Type,
} from "../types";
import { verify } from "../utils/helper-functions";
import deployMockTokens from "./00-deploy-tokens";
import { ContractTransaction } from "ethers";

const deployFundABusiness: DeployFunction = async function (
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
  const waitBlockConfirmations: number = getBlockConfirmations(
    developmentChains,
    network
  );
  if (chainId == 31337) {
    log("Local network detected! Deploying FundABusiness...");
    // const baseUriObjects: string =
    //   process.env.BASE_URI_OBJECTS || BASE_URI_OBJECTS;
    // const baseUriResources: string =
    //   process.env.BASE_URI_RESOURCES || BASE_URI_RESOURCES;

    // const accounts = await ethers.getSigners();
    const mockErc20Contract: MockERC20Type = await ethers.getContract(
      "MockERC20"
    );

    const args = [
      mockErc20Contract.address,
      business_account,
      treasury_account,
      CROWDDIT_FEE_FRACTION,
      AMOUNTS_TO_BE_RAISED,
      CAMPAIGN_PERIOD,
      FUNDERS_TIERS_AND_COST,
      MILESTONE_SCHEDULE,
    ];

    const fundABiz: DeployResult = await deploy("FundABusiness", {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: waitBlockConfirmations,
    });

    log("FundABusiness Deployed!");
    log("-----------------------------------------------------------");

    // Verify the contracts
    if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
    ) {
      log("Verifying...");
      await verify(fundABiz.address, args);
    }

    // Set up NFT Contract
    log("-----------------------------------------------------------");
    log("Setting up NFT contracts for Minter role...");

    for (let i = 0; i < nftTiersContracts.length; i++) {
      const nftTierContract: BasicNftType = await ethers.getContractAt(
        "BasicNft",
        nftTiersAddresses[i],
        deployer
      );

      const minter = await nftTierContract.MINTER_ROLE();

      const tx1: ContractTransaction = await nftTierContract.grantRole(
        minter,
        fundABiz.address,
        { from: deployer }
      );
      await tx1.wait();
    }

    log("Minter role granted to FundABusiness Contract!");
  }
};

export default deployFundABusiness;
deployFundABusiness.tags = ["all", "funding"];
