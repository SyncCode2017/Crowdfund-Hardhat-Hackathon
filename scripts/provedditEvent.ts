import { ethers } from "hardhat";
import ABI from "../FundABusinessAbi.json";

async function getTheTrueOwnerEvent() {
  const fundAbizAddress = "0xE426E6cE71D1883B6F3104AD581a61A3c6C32b83";
  const provider = new ethers.providers.WebSocketProvider(
    `wss://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_KEY}`
  );
  const fundAbiz = new ethers.Contract(fundAbizAddress, ABI, provider);

  try {
    fundAbiz.on("TheOwnerIs", (owner, tier, tokenId, event) => {
      let ownerOfEvent = {
        from: owner,
        tier: tier,
        tokenId: tokenId,
        eventData: event,
      };
      console.log(JSON.stringify(ownerOfEvent, null, 4));
    });
    // fundAbiz.on("IsTheTrueOwner", (owner, tier, tokenId, event) => {
    //   let ownerOfEvent = {
    //     from: owner,
    //     tier: tier,
    //     tokenId: tokenId,
    //     eventData: event,
    //   };
    //   console.log(JSON.stringify(ownerOfEvent, null, 4));
    // });
    // fundAbiz.on("NotTheTrueOwner", (tier, tokenId, event) => {
    //   let ownerOfEvent = {
    //     tier: tier,
    //     tokenId: tokenId,
    //     eventData: event,
    //   };
    //   console.log(JSON.stringify(ownerOfEvent, null, 3));
    // });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
getTheTrueOwnerEvent();
