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
  nftPerksAddresses,
  MOAT_WALLETS,
} from "../utils/constants";
import { getBlockConfirmations } from "../utils/helper-functions";
import {
  NftPerks as NftPerksType,
  MockV3Aggregator as MockV3AggregatorType,
} from "../types";
import { networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/helper-functions";
import { ContractTransaction } from "ethers";
import setNftContracts from "../utils/set-nft-contracts";

const deployFundABusiness: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let business_account: string, treasury_account: string, price_feed: string;

  if (developmentChains.includes(network.name)) {
    ({ business_account, treasury_account } = await getNamedAccounts());
    const mockAggregator: MockV3AggregatorType = await ethers.getContract(
      "MockV3Aggregator"
    );
    price_feed = mockAggregator.address;
  } else {
    business_account = MOAT_WALLETS[1];
    treasury_account = MOAT_WALLETS[2];
    price_feed =
      networkConfig[network.name].ethUsdPriceFeed! ||
      networkConfig[network.name].maticUsdPriceFeed!;
  }
  const waitBlockConfirmations: number = getBlockConfirmations(
    developmentChains,
    network
  );

  log("Deploying FundABusiness...");

  const args = [
    business_account,
    treasury_account,
    MOAT_FEE_NUMERATOR,
    price_feed,
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

  // Set up NFT Contract on local network
  // if (developmentChains.includes(network.name)) {
  log("-----------------------------------------------------------");
  log("Setting up NFT contracts for Minter role...");

  for (let i = 0; i < nftPerksAddresses.length; i++) {
    const nftTierContract: NftPerksType = await ethers.getContractAt(
      "NftPerks",
      nftPerksAddresses[i],
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

  log("Nft Minter role granted to FundABusiness Contract !");

  //  Set the NFT Perks Contracts to the FundABusiness Contract and Default Admin Role revoked
  const SET_NFT_PERKS = process.env.SET_NFT_PERKS!;
  if (SET_NFT_PERKS === "true") {
    await setNftContracts(nftPerksAddresses);

    for (let i = 0; i < nftPerksAddresses.length; i++) {
      const nftTierContract: NftPerksType = await ethers.getContractAt(
        "NftPerks",
        nftPerksAddresses[i],
        deployer
      );

      const adminRole = await nftTierContract.DEFAULT_ADMIN_ROLE();

      const revokeTx = await nftTierContract.revokeRole(adminRole, deployer, {
        from: deployer,
      });
      await revokeTx.wait();
    }
  }
};

export default deployFundABusiness;
deployFundABusiness.tags = ["all", "funding"];
