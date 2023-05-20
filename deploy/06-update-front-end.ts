import { frontEndContractsFile, frontEndAbiLocation } from "../utils/constants";
import "dotenv/config";
import fs from "fs";
import { network, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { NftPerks as NftPerksType } from "../types";
import { developmentChains, nftPerksAddresses } from "../utils/constants";

const updateFrontEnd: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  if (process.env.UPDATE_FRONT_END! == "true") {
    console.log("Writing to front end...");
    await updateContractAddresses();
    await updateAbi();
    console.log("Front end written!");
  }
};

async function updateAbi() {
  let nftPerksContracts: NftPerksType[] = [];

  // FundABusiness Contract
  const fundABiz = await ethers.getContract("FundABusiness");
  fs.writeFileSync(
    `${frontEndAbiLocation}FundABusiness.json`,
    fundABiz.interface.format(ethers.utils.FormatTypes.json).toString()
  );

  // NFT perks contracts
  for (let i = 0; i < nftPerksAddresses.length; i++) {
    nftPerksContracts.push(
      await ethers.getContractAt("NftPerks", nftPerksAddresses[i])
    );

    fs.writeFileSync(
      `${frontEndAbiLocation}NftPerks${i + 1}.json`,
      nftPerksContracts[i].interface
        .format(ethers.utils.FormatTypes.json)
        .toString()
    );
  }
}

async function updateContractAddresses() {
  const chainId = network.config.chainId!.toString();
  const fundABiz = await ethers.getContract("FundABusiness");
  const fundABizAddress = JSON.parse(
    fs.readFileSync(frontEndContractsFile[0], "utf8")
  );
  if (chainId in fundABizAddress) {
    if (!fundABizAddress[chainId]["FundABusiness"].includes(fundABiz.address)) {
      fundABizAddress[chainId]["FundABusiness"].push(fundABiz.address);
    }
  } else {
    fundABizAddress[chainId] = { FundABusiness: [fundABiz.address] };
  }
  fs.writeFileSync(frontEndContractsFile[0], JSON.stringify(fundABizAddress));

  const frontEndNftContractsFile = frontEndContractsFile[1];
  const nftPerkAddress = JSON.parse(
    fs.readFileSync(frontEndNftContractsFile, "utf8")
  );
  for (let i = 1; i <= nftPerksAddresses.length; i++) {
    if (chainId in nftPerkAddress) {
      if (
        !nftPerkAddress[chainId][`NftPerks${i}`].includes(
          nftPerksAddresses[i - 1]
        ) ||
        null
      ) {
        nftPerkAddress[chainId][`NftPerks${i}`].push(nftPerksAddresses[i - 1]);
      }
    } else {
      const nft = `NftPerks${i}`;
      nftPerkAddress[chainId] = {
        [nft]: [nftPerksAddresses[i - 1]],
      };
    }
    fs.writeFileSync(frontEndNftContractsFile, JSON.stringify(nftPerkAddress));
  }
}
export default updateFrontEnd;
updateFrontEnd.tags = ["all", "frontend"];
