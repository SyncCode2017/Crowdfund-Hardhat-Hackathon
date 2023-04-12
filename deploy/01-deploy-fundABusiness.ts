import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import {
  developmentChains,
  MOAT_FEE_NUMERATOR,
  AMOUNTS_TO_BE_RAISED,
  CAMPAIGN_PERIOD,
  FUNDERS_TIERS_AND_COST,
  MILESTONE_SCHEDULE,
  nftMockAddresses,
  MOAT_WALLETS,
  ALLOWED_TOKEN,
} from "../utils/constants";
import { getBlockConfirmations } from "../utils/helper-functions";
import { BasicNft as BasicNftType, MockERC20 as MockERC20Type } from "../types";
import { verify } from "../utils/helper-functions";
import { ContractTransaction } from "ethers";

const deployFundABusiness: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let business_account: string, treasury_account: string, allowedToken: string;

  const mockErc20Contract: MockERC20Type = await ethers.getContract(
    "MockERC20"
  );

  if (developmentChains.includes(network.name)) {
    ({ business_account, treasury_account } = await getNamedAccounts());
    allowedToken = mockErc20Contract.address;
  } else {
    business_account = MOAT_WALLETS[1];
    treasury_account = MOAT_WALLETS[2];
    allowedToken = ALLOWED_TOKEN ? ALLOWED_TOKEN : mockErc20Contract.address;
  }
  const waitBlockConfirmations: number = getBlockConfirmations(
    developmentChains,
    network
  );

  log("Deploying FundABusiness...");

  const args = [
    allowedToken,
    business_account,
    treasury_account,
    MOAT_FEE_NUMERATOR,
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
    process.env.POLYGONSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(fundABiz.address, args);
  }

  // Set up Mock NFT Contract on local network
  if (developmentChains.includes(network.name)) {
    log("-----------------------------------------------------------");
    log("Setting up Mock NFT contracts for Minter role...");

    for (let i = 0; i < nftMockAddresses.length; i++) {
      const nftTierContract: BasicNftType = await ethers.getContractAt(
        "BasicNft",
        nftMockAddresses[i],
        deployer
      );

      const minter = await nftTierContract.MINTER_ROLE();
      const adminRole = await nftTierContract.DEFAULT_ADMIN_ROLE();

      const tx1: ContractTransaction = await nftTierContract.grantRole(
        minter,
        fundABiz.address,
        { from: deployer }
      );
      await tx1.wait();

      const revokeTx = await nftTierContract.revokeRole(adminRole, deployer, {
        from: deployer,
      });
      await revokeTx.wait();
    }

    log(
      "Mock Nft Minter role granted to FundABusiness Contract and Default Admin Role revoked!"
    );
  }
};

export default deployFundABusiness;
deployFundABusiness.tags = ["all", "funding"];
