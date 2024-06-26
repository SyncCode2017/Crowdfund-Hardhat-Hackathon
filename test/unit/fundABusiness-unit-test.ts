import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { ContractTransaction } from "ethers";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import {
  nftPerksAddresses,
  TIERS,
  TIER1_PRICE,
  TIER2_PRICE,
  TIER3_PRICE,
  MOAT_FEE_NUMERATOR,
  AMOUNTS_TO_BE_RAISED,
  ADDRESS_ZERO,
  FUNDERS_TIERS_AND_COST,
  MILESTONE_SCHEDULE,
  CAMPAIGN_PERIOD,
  FAILURE,
  TARGETMET,
  developmentChains,
} from "../../utils/constants";
import {
  MockV3Aggregator as MockV3AggregatorType,
  NftPerks as NftPerksType,
  FundABusiness as FundABusinessType,
} from "../../types";
import setNftContracts from "../../utils/set-nft-contracts";
import {
  TestAccount,
  getAccountBalances,
  setupUser,
  sumOfElementsInArray,
} from "../../utils/helper-functions";
import { moveTime } from "../../utils/move-time";

const setup = deployments.createFixture(async () => {
  await deployments.fixture("all");
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

  const contracts = {
    fundABiz: <FundABusinessType>await ethers.getContract("FundABusiness"),
    nftTier1Contract: <NftPerksType>(
      await ethers.getContractAt("NftPerks", nftPerksAddresses[0])
    ),
    nftTier2Contract: <NftPerksType>(
      await ethers.getContractAt("NftPerks", nftPerksAddresses[1])
    ),
    nftTier3Contract: <NftPerksType>(
      await ethers.getContractAt("NftPerks", nftPerksAddresses[2])
    ),
  };
  return {
    ...contracts,
    deployer: await setupUser(deployer, contracts),
    business_account: await setupUser(business_account, contracts),
    treasury_account: await setupUser(treasury_account, contracts),
    alice: await setupUser(alice, contracts),
    bob: await setupUser(bob, contracts),
    charlie: await setupUser(charlie, contracts),
    dave: await setupUser(dave, contracts),
    erin: await setupUser(erin, contracts),
  };
});

function checkArrayElements(values: unknown[], matchWith: unknown[]) {
  for (let i = 0; i < values.length; i++) {
    assert.equal(typeof values[i], typeof matchWith[i]);
    assert.equal(values[i], matchWith[i]);
  }
}

describe("FundABusiness Unit Tests", function () {
  let deployer: TestAccount,
    alice: TestAccount,
    bob: TestAccount,
    charlie: TestAccount,
    dave: TestAccount,
    erin: TestAccount,
    accounts: SignerWithAddress[],
    funders: TestAccount[],
    fundersAddresses: string[],
    quantities: number[],
    fundingAmounts: number[],
    fundABiz: FundABusinessType,
    business_account: TestAccount,
    treasury_account: TestAccount,
    nftTier1Contract: NftPerksType,
    nftTier2Contract: NftPerksType,
    nftTier3Contract: NftPerksType;

  beforeEach("Set up accounts and contract", async () => {
    ({
      deployer,
      business_account,
      treasury_account,
      alice,
      bob,
      charlie,
      dave,
      erin,
      fundABiz,
      nftTier1Contract,
      nftTier2Contract,
      nftTier3Contract,
    } = await setup());
    accounts = await ethers.getSigners();
    funders = [alice, bob, charlie, dave, erin];
    quantities = [10, 5, 5, 10, 7];
    fundersAddresses = funders.map((x) => x.address);
  });

  async function crowdFundABiz(funders: TestAccount[], quantities: number[]) {
    fundingAmounts = [];
    for (let i = 0; i < funders.length; i++) {
      const tier1TotalEthAmountInWei = await fundABiz.getOneNativeCoinRate(
        TIERS[0],
        quantities[i]
      );
      const tier2TotalEthAmountInWei = await fundABiz.getOneNativeCoinRate(
        TIERS[1],
        quantities[i]
      );
      const tier3TotalEthAmountInWei = await fundABiz.getOneNativeCoinRate(
        TIERS[2],
        quantities[i]
      );
      const tx1: ContractTransaction = await funders[i].fundABiz.contribute(
        TIERS[0],
        quantities[i],
        { value: tier1TotalEthAmountInWei }
      );
      await tx1.wait();
      const tx2: ContractTransaction = await funders[i].fundABiz.contribute(
        TIERS[1],
        quantities[i],
        { value: tier2TotalEthAmountInWei }
      );
      await tx2.wait();
      const tx3: ContractTransaction = await funders[i].fundABiz.contribute(
        TIERS[2],
        quantities[i],
        { value: tier3TotalEthAmountInWei }
      );
      await tx3.wait();
      const sumOfAmountsInEth = sumOfElementsInArray([
        Number(ethers.utils.formatEther(tier1TotalEthAmountInWei)),
        Number(ethers.utils.formatEther(tier2TotalEthAmountInWei)),
        Number(ethers.utils.formatEther(tier3TotalEthAmountInWei)),
      ]);

      fundingAmounts.push(sumOfAmountsInEth);
    }
    console.log("Business crowd-funded!");
  }

  describe("constructor", function () {
    it("Check FundABusiness is deployed", async () => {
      expect(fundABiz.address).to.be.not.empty;
    });

    it("initiallizes businessAddress correctly", async () => {
      const businessAddress: string = await fundABiz.businessAddress();
      assert.equal(businessAddress, business_account.address);
    });

    it("initiallizes moatFeeNumerator correctly", async () => {
      const feeNum = Number(await fundABiz.moatFeeNumerator());
      assert.equal(feeNum, MOAT_FEE_NUMERATOR);
    });

    it("initiallizes minTargetAmount correctly", async () => {
      const minTargetAmount = await fundABiz.minTargetAmount();
      assert.equal(
        minTargetAmount.toString(),
        AMOUNTS_TO_BE_RAISED[0].toString()
      );
    });

    it("initiallizes targetAmount correctly", async () => {
      const targetAmount = await fundABiz.targetAmount();
      assert.equal(targetAmount.toString(), AMOUNTS_TO_BE_RAISED[1].toString());
    });

    it("initiallizes tierCost correctly", async () => {
      let tierCosts = [];
      const expectedTierPrices = [
        TIER1_PRICE.toString(),
        TIER2_PRICE.toString(),
        TIER3_PRICE.toString(),
      ];
      for (let i = 0; i < TIERS.length; i++) {
        tierCosts.push((await fundABiz.tierCost(TIERS[i])).toString());
        const tierPrice = Number(await fundABiz.getTierPrice(TIERS[i]));
        assert.equal(tierPrice, Number(expectedTierPrices[i]));
      }
      checkArrayElements(tierCosts, expectedTierPrices);
    });
  });

  describe("contributeOnBehalfOf and contribute functions", function () {
    it("allows funders to contribute whenNotPaused and campaign is open", async () => {
      const totalTierQuantities = sumOfElementsInArray(quantities);
      // movetime to when campaign has started
      await moveTime(31968000);
      const initialBals: number[] = await getAccountBalances(
        fundersAddresses,
        fundABiz
      );
      await crowdFundABiz(funders, quantities);
      const finalBals: number[] = await getAccountBalances(
        fundersAddresses,
        fundABiz
      );
      const currentFunders: string[] =
        await deployer.fundABiz.getFundersAddresses();

      let totalTiersQuantitiesBought: number[] = [];

      for (let index in TIERS) {
        totalTiersQuantitiesBought.push(
          Number(await deployer.fundABiz.getQuantityOfTierBought(TIERS[index]))
        );
      }

      checkArrayElements(currentFunders, fundersAddresses);

      for (let i in TIERS) {
        assert.equal(totalTierQuantities, totalTiersQuantitiesBought[i]);
      }

      for (let i in fundingAmounts) {
        assert.equal(
          Math.floor(initialBals[i] - finalBals[i]),
          Math.floor(fundingAmounts[i])
        );
      }
    });

    it("rejects contribution when campaign is not open", async () => {
      // movetime to when campaign has closed
      await moveTime(60480000);
      const quantity = 1;
      await expect(alice.fundABiz.contribute(TIERS[0], quantity)).to.be
        .rejected; //With("CampaignNotOpen()");
    });

    it("rejects contribution when contract is paused", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const quantity = 5;
      const tx = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(alice.fundABiz.contribute(TIERS[0], quantity)).to.be
        .reverted; //With("Pausable: paused");
    });

    it("rejects contribution for zero address", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const quantity = 1;
      await expect(
        alice.fundABiz.contributeOnBehalfOf(ADDRESS_ZERO, TIERS[0], quantity)
      ).to.be.reverted;
    });

    it("emits ContributionReceived event", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const quantity = 5;
      const tier1TotalEthAmountInWei = await fundABiz.getOneNativeCoinRate(
        TIERS[0],
        quantity
      );
      await expect(
        alice.fundABiz.contribute(TIERS[0], quantity, {
          value: tier1TotalEthAmountInWei,
        })
      )
        .to.emit(fundABiz, "ContributionReceived")
        .withArgs(alice.address, TIERS[0]);
    });
  });
  describe("claimRefundFor/claimRefund functions", function () {
    beforeEach("crowd fund a business", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await crowdFundABiz(funders, quantities);
    });
    it("allows claiming refund when campaign has failed", async () => {
      await moveTime(1000);
      // MOAT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      const initialBals: number[] = await getAccountBalances(
        fundersAddresses,
        fundABiz
      );
      for (let i = 0; i < funders.length; i++) {
        const tx1: ContractTransaction = await funders[i].fundABiz.claimRefund(
          TIERS[0]
        );
        await tx1.wait();
        const tx2: ContractTransaction = await funders[i].fundABiz.claimRefund(
          TIERS[1]
        );
        await tx2.wait();
        const tx3: ContractTransaction = await funders[i].fundABiz.claimRefund(
          TIERS[2]
        );
        await tx3.wait();
      }
      const finalBals: number[] = await getAccountBalances(
        fundersAddresses,
        fundABiz
      );
      for (let i = 0; i < fundingAmounts.length; i++) {
        assert.equal(
          (finalBals[i] - initialBals[i]).toFixed(2),
          fundingAmounts[i].toFixed(2)
        );
      }
    });
    it("allows airdropping refund to funders when campaign has failed", async () => {
      await moveTime(1000);
      // MOAT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      const initialBals: number[] = await getAccountBalances(
        fundersAddresses,
        fundABiz
      );
      for (let i = 0; i < funders.length; i++) {
        const tx1: ContractTransaction =
          await treasury_account.fundABiz.claimRefundFor(
            funders[i].address,
            TIERS[0]
          );
        await tx1.wait();
        const tx2: ContractTransaction =
          await treasury_account.fundABiz.claimRefundFor(
            funders[i].address,
            TIERS[1]
          );
        await tx2.wait();
        const tx3: ContractTransaction =
          await treasury_account.fundABiz.claimRefundFor(
            funders[i].address,
            TIERS[2]
          );
        await tx3.wait();
      }
      const finalBals: number[] = await getAccountBalances(
        fundersAddresses,
        fundABiz
      );
      for (let i = 0; i < fundingAmounts.length; i++) {
        assert.equal(
          Math.floor(finalBals[i] - initialBals[i]),
          Math.floor(fundingAmounts[i])
        );
      }
    });
    it("rejects claiming refund when campaign succeeds", async () => {
      // MOAT decides to close the campaign due to TARGETMET
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        TARGETMET
      );
      await tx.wait();
      for (let i = 0; i < funders.length; i++) {
        await expect(funders[i].fundABiz.claimRefund(TIERS[0])).to.be.rejected; //With("NoRefund()");
        await expect(funders[i].fundABiz.claimRefund(TIERS[1])).to.be.rejected; //With("NoRefund()");
        await expect(funders[i].fundABiz.claimRefund(TIERS[2])).to.be.rejected; //With("NoRefund()");
      }
    });
    it("rejects claiming refund when caller is not a funder", async () => {
      await moveTime(1000);
      // MOAT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      await expect(deployer.fundABiz.claimRefund(TIERS[2])).to.be.rejected; //With(
      //   "NotAFunder()"
      // );
    });
    it("rejects claiming refund when contract is paused", async () => {
      // MOAT decides to close the campaign due to TARGETMET
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        0
      );
      await tx.wait();
      // pause the contract
      const tx1 = await deployer.fundABiz.pause();
      await tx1.wait();
      for (let i = 0; i < funders.length; i++) {
        await expect(funders[i].fundABiz.claimRefund(TIERS[0])).to.be.rejected; //With("Pausable: paused");
        await expect(funders[i].fundABiz.claimRefund(TIERS[1])).to.be.rejected; //With("Pausable: paused");
        await expect(funders[i].fundABiz.claimRefund(TIERS[2])).to.be.rejected; //With("Pausable: paused");
      }
    });
    it("emits ContributionRefunded", async () => {
      await moveTime(1000);
      // MOAT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      await expect(bob.fundABiz.claimRefund(TIERS[2]))
        .to.emit(fundABiz, "ContributionRefunded")
        .withArgs(bob.address, TIERS[2]);
    });
  });

  describe("claimNft/claimNftFor function", function () {
    beforeEach("crowd fund a business", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await crowdFundABiz(funders, quantities);
    });
    it("allows funders to claim nft perks", async () => {
      await moveTime(31968000);
      await setNftContracts(nftPerksAddresses);

      for (let i = 0; i < funders.length; i++) {
        const tx1: ContractTransaction = await funders[i].fundABiz.claimNft(
          TIERS[0]
        );
        await tx1.wait();
        const tx2: ContractTransaction = await funders[i].fundABiz.claimNft(
          TIERS[1]
        );
        await tx2.wait();
        const tx3: ContractTransaction = await funders[i].fundABiz.claimNft(
          TIERS[2]
        );
        await tx3.wait();
        const lastTokenIdTier1 = Number(await nftTier1Contract.tokenId()) - 1;
        const lastTokenIdTier2 = Number(await nftTier2Contract.tokenId()) - 1;
        const lastTokenIdTier3 = Number(await nftTier3Contract.tokenId()) - 1;
        expect(await nftTier1Contract.ownerOf(lastTokenIdTier1)).to.be.equal(
          funders[i].address
        );
        expect(await nftTier2Contract.ownerOf(lastTokenIdTier2)).to.be.equal(
          funders[i].address
        );
        expect(await nftTier3Contract.ownerOf(lastTokenIdTier3)).to.be.equal(
          funders[i].address
        );
      }
    });
    it("allows airdropping NFT perks to funders", async () => {
      await moveTime(31968000);
      await setNftContracts(nftPerksAddresses);

      for (let i = 0; i < funders.length; i++) {
        const tx1: ContractTransaction =
          await treasury_account.fundABiz.claimNftFor(
            funders[i].address,
            TIERS[0]
          );
        await tx1.wait();
        const tx2: ContractTransaction =
          await treasury_account.fundABiz.claimNftFor(
            funders[i].address,
            TIERS[1]
          );
        await tx2.wait();
        const tx3: ContractTransaction =
          await treasury_account.fundABiz.claimNftFor(
            funders[i].address,
            TIERS[2]
          );
        await tx3.wait();
        const lastTokenIdTier1 = Number(await nftTier1Contract.tokenId()) - 1;
        const lastTokenIdTier2 = Number(await nftTier2Contract.tokenId()) - 1;
        const lastTokenIdTier3 = Number(await nftTier3Contract.tokenId()) - 1;

        expect(await nftTier1Contract.ownerOf(lastTokenIdTier1)).to.be.equal(
          funders[i].address
        );
        expect(await nftTier2Contract.ownerOf(lastTokenIdTier2)).to.be.equal(
          funders[i].address
        );
        expect(await nftTier3Contract.ownerOf(lastTokenIdTier3)).to.be.equal(
          funders[i].address
        );
      }
    });
    it("rejects non-funders from claiming NFT", async () => {
      await moveTime(31968000);
      await setNftContracts(nftPerksAddresses);

      await expect(deployer.fundABiz.claimNft(TIERS[1])).to.be.rejected; //With(
      //   "NotAFunder()"
      // );
    });
    it("rejects NFT claiming when contract is paused", async () => {
      await moveTime(31968000);
      await setNftContracts(nftPerksAddresses);
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejected; //With(
      //   "Pausable: paused"
      // );
    });
    it("rejects NFT claiming when NFT contracts are not set", async () => {
      await moveTime(31968000);
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejected; //With(
      //   "NftTokensNotSet()"
      // );
    });
    it("rejects NFT claiming when campaign is unsuccesful", async () => {
      await setNftContracts(nftPerksAddresses);
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejected; //With(
      //   "CampaignUnsuccessful()"
      // );
    });
    it("rejects NFT claiming when NFT has been claimed", async () => {
      await moveTime(31968000);
      await setNftContracts(nftPerksAddresses);
      const tx: ContractTransaction = await dave.fundABiz.claimNft(TIERS[1]);
      await tx.wait();
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejected; //With(
      //   "FunderHasClaimedNft()"
      // );
    });
  });
  describe("withdrawFundRaised function", function () {
    beforeEach("Crowd fund a business", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await crowdFundABiz(funders, quantities);
    });
    it("allows businessAddress to withdraw", async () => {
      const milestoneData = [0, 0.2];
      // movetime to when campaign has closed
      await moveTime(31968000);
      // release the first installment
      const tx: ContractTransaction =
        await deployer.fundABiz.approveMilestoneAndReleaseFund(
          milestoneData[0]
        );
      await tx.wait();
      const initialBals: number[] = await getAccountBalances(
        [business_account.address],
        fundABiz
      );
      const tx1: ContractTransaction =
        await business_account.fundABiz.withdrawFundRaised();
      await tx1.wait();
      const netFundRaisedWei = (await fundABiz.fundRaisedMinusFee()).toString();
      const amountReleased =
        Number(ethers.utils.formatEther(netFundRaisedWei)) * milestoneData[1];
      const finalBals: number[] = await getAccountBalances(
        [business_account.address],
        fundABiz
      );
      assert.equal(
        (finalBals[0] - initialBals[0]).toFixed(3),
        amountReleased.toFixed(3)
      );
    });
    it("allows manager to change businessAddress several times ", async () => {
      const milestones = [0, 1, 2, 3];
      const businessAccounts = [business_account, alice, bob, dave];
      // movetime to when campaign has closed
      await moveTime(31968000);
      for (let i = 0; i < businessAccounts.length; i++) {
        // Change the business address
        const tx2: ContractTransaction =
          await deployer.fundABiz.setBusinessAddress(
            businessAccounts[i].address
          );
        await tx2.wait();

        // release the second installment
        const tx3: ContractTransaction =
          await deployer.fundABiz.approveMilestoneAndReleaseFund(milestones[i]);
        await tx3.wait();
        expect(
          Number(await fundABiz.businessBalance(businessAccounts[i].address))
        ).to.be.greaterThan(0);

        // Business address withdraws the second installment
        if (i > 0) {
          expect(
            businessAccounts[i - 1].fundABiz.withdrawFundRaised()
          ).to.be.rejectedWith("NotTheOwner()");
        }
        const tx4: ContractTransaction = await businessAccounts[
          i
        ].fundABiz.withdrawFundRaised();
        await tx4.wait();
        expect(
          Number(await fundABiz.businessBalance(businessAccounts[i].address))
        ).to.equal(0);
      }

      const finalContractBal: number[] = await getAccountBalances(
        [fundABiz.address],
        fundABiz
      );
      assert.equal(finalContractBal[0], 0);
    });
    it("correctly calculates the amount to release after every milestone", async () => {
      const milestones = [0, 1, 2, 3];
      const milestoneFractions = [0.2, 0.3, 0.4, 0.1];
      // movetime to when campaign has closed
      await moveTime(31968000);

      for (let index in milestones) {
        // Approve milestone and release fund
        const tx: ContractTransaction =
          await deployer.fundABiz.approveMilestoneAndReleaseFund(
            milestones[index]
          );
        await tx.wait();

        const initialBals: number[] = await getAccountBalances(
          [business_account.address, fundABiz.address],
          fundABiz
        );

        const netFundRaisedWei = await fundABiz.fundRaisedMinusFee();
        const netFundRaisedEth = Number(
          ethers.utils.formatEther(netFundRaisedWei)
        );
        const amountReleasedInEth =
          netFundRaisedEth * milestoneFractions[index];
        const tx1: ContractTransaction =
          await business_account.fundABiz.withdrawFundRaised();
        await tx1.wait();

        const finalBals: number[] = await getAccountBalances(
          [business_account.address, fundABiz.address],
          fundABiz
        );

        for (let index in finalBals) {
          assert.equal(
            Math.abs(finalBals[index] - initialBals[index]).toFixed(3),
            Math.abs(amountReleasedInEth).toFixed(3)
          );
        }
      }

      const finalContractBal: number[] = await getAccountBalances(
        [fundABiz.address],
        fundABiz
      );
      assert.equal(finalContractBal[0], 0);
    });
    it("reject withdrawal when no fund is due", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      await expect(business_account.fundABiz.withdrawFundRaised()).to.be
        .rejected; //With("NoFundDue()");
    });
    it("rejects withdrawal when contract is paused", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(business_account.fundABiz.withdrawFundRaised()).to.be
        .rejected; //With("Pausable: paused");
    });
    it("rejects withdrawal when campaign is unsuccesful", async () => {
      await moveTime(1000);
      // MOAT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      await expect(business_account.fundABiz.withdrawFundRaised()).to.be
        .rejected; //With("CampaignUnsuccessful()");
    });
    it("allows only businessAddress to withdraw", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      await expect(deployer.fundABiz.withdrawFundRaised()).to.be.rejected; //With(
      //   "NotTheOwner()"
      // );
    });
    it("emits FundReleased event", async () => {
      const milestoneData = [0, 0.2];
      // movetime to when campaign has closed
      await moveTime(31968000);
      // release the first installment
      const tx: ContractTransaction =
        await deployer.fundABiz.approveMilestoneAndReleaseFund(
          milestoneData[0]
        );
      await tx.wait();
      await expect(business_account.fundABiz.withdrawFundRaised()).to.emit(
        fundABiz,
        "FundReleased"
      );
    });
  });
  describe("closeFundingRound function", function () {
    beforeEach("Crowd fund a business", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await crowdFundABiz(funders, quantities);
    });
    it("allows manager role to close funding round", async () => {
      await moveTime(1000);
      const initialBals: number[] = await getAccountBalances(
        [treasury_account.address],
        fundABiz
      );
      // MOAT decides to close the campaign due to TARGETMET
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        TARGETMET
      );
      await tx.wait();
      const finalBals: number[] = await getAccountBalances(
        [treasury_account.address],
        fundABiz
      );
      expect(finalBals[0]).to.be.greaterThan(initialBals[0]);
      const quantity = 10;
      await expect(erin.fundABiz.contribute(TIERS[1], quantity)).to.be.rejected; //With("CampaignNotOpen()");
    });
    it("allows manager role to close funding round when contract is paused", async () => {
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await moveTime(1000);
      const tx1: ContractTransaction =
        await deployer.fundABiz.closeFundingRound(TARGETMET);
      await tx1.wait();
      const tx2: ContractTransaction = await deployer.fundABiz.unpause();
      await tx2.wait();
      const quantity = 10;
      await expect(erin.fundABiz.contribute(TIERS[1], quantity)).to.be.rejected; //With("CampaignNotOpen()");
    });
    it("allows only manager role to close funding round", async () => {
      await moveTime(1000);
      await expect(bob.fundABiz.closeFundingRound(FAILURE)).to.be.rejected; //With(
      //   "AccessControl"
      // );
    });
    it("emits CampaignSuccessful event", async () => {
      await moveTime(1000);
      await expect(deployer.fundABiz.closeFundingRound(TARGETMET)).to.emit(
        fundABiz,
        "CampaignSuccessful"
      );
    });
    it("emits CampaignFailed event", async () => {
      await moveTime(1000);
      await expect(deployer.fundABiz.closeFundingRound(FAILURE)).to.emit(
        fundABiz,
        "CampaignFailed"
      );
    });
    it("rejects funding round closure for invalid reason", async () => {
      await moveTime(1000);
      const invalidReason = 2;
      await expect(deployer.fundABiz.closeFundingRound(invalidReason)).to.be
        .rejected;
    });
  });

  describe("approveMilestoneAndReleaseFund function", function () {
    beforeEach("Crowd fund a business", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await crowdFundABiz(funders, quantities);
    });
    it("allows Manager Role to approve milestone and release fund", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const milestoneData = [0, 0.2];
      // release the first installment
      const tx: ContractTransaction =
        await deployer.fundABiz.approveMilestoneAndReleaseFund(
          milestoneData[0]
        );
      await tx.wait();
      const netFundRaisedWei = (await fundABiz.fundRaisedMinusFee()).toString();
      const amountReleased =
        Number(ethers.utils.formatEther(netFundRaisedWei)) * milestoneData[1];
      const businessBalWei = await fundABiz.businessBalance(
        business_account.address
      );
      const businessBal = Number(ethers.utils.formatEther(businessBalWei));
      assert.equal(businessBal.toFixed(3), amountReleased.toFixed(3));
    });
    it("allows Manager Role to approve multiple milestones and release funds", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const milestoneData0 = [0, 0.2];
      const milestoneData1 = [1, 0.3];
      // approve milestone 0
      const tx: ContractTransaction =
        await deployer.fundABiz.approveMilestoneAndReleaseFund(
          milestoneData0[0]
        );
      await tx.wait();
      // approve milestone 1
      const tx1: ContractTransaction =
        await deployer.fundABiz.approveMilestoneAndReleaseFund(
          milestoneData1[0]
        );
      await tx1.wait();
      const netFundRaisedWei = (await fundABiz.fundRaisedMinusFee()).toString();
      const amountReleased =
        Number(ethers.utils.formatEther(netFundRaisedWei)) *
        (milestoneData0[1] + milestoneData1[1]);
      const businessBalWei = await fundABiz.businessBalance(
        business_account.address
      );
      const businessBal = Number(ethers.utils.formatEther(businessBalWei));
      assert.equal(businessBal, amountReleased);
    });
    it("releases all the tokens after the last milestone", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      // approve all the milestones
      for (let milestoneData in MILESTONE_SCHEDULE) {
        const tx2: ContractTransaction =
          await deployer.fundABiz.approveMilestoneAndReleaseFund(
            milestoneData[0]
          );
        await tx2.wait();
      }
      const tx3: ContractTransaction =
        await business_account.fundABiz.withdrawFundRaised();
      await tx3.wait();
      const finalContractBal: number[] = await getAccountBalances(
        [fundABiz.address],
        fundABiz
      );
      assert.equal(finalContractBal[0], 0);
    });
    it("rejects milestone approval when paused", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const milestoneData = [0, 0.2];
      // pause the contract
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(
        deployer.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejected; //With("Pausable: paused");
    });
    it("allows only Manager role to approve milestone", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const milestoneData = [0, 0.2];
      await expect(
        dave.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejected; //With("AccessControl");
    });
    it("does not allow approving the same milestone more than once", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const milestoneData = [0, 0.2];
      // approve milestone 0
      const tx: ContractTransaction =
        await deployer.fundABiz.approveMilestoneAndReleaseFund(
          milestoneData[0]
        );
      await tx.wait();
      await expect(
        deployer.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejected; //With("AlreadyApproved()");
    });
    it("does not allow approval if campaign fails", async () => {
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      const milestoneData = [0, 0.2];
      await expect(
        deployer.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejected; //With("CampaignUnsuccessful()");
    });
    it("does not allow approval before campaign ends", async () => {
      const milestoneData = [0, 0.2];
      await expect(
        deployer.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejected; //With("Undecided()");
    });
  });

  describe("setters function", function () {
    it("allows only manager to setNftPerkContracts ", async () => {
      const TIERS_AND_NFT_CONTRACTS: [number, string][] = [
        [TIERS[0], nftPerksAddresses[0]],
        [TIERS[1], nftPerksAddresses[1]],
        [TIERS[2], nftPerksAddresses[2]],
      ];
      await expect(
        //@ts-ignore
        bob.fundABiz.setNftPerkContracts(TIERS_AND_NFT_CONTRACTS)
      ).to.be.rejected; //With("AccessControl");
    });

    it("allows only manager to setTreasuryAddress", async () => {
      await expect(alice.fundABiz.setTreasuryAddress(business_account.address))
        .to.be.rejected; //With("AccessControl");
    });

    it("allows only manager to setBusinessAddress", async () => {
      await expect(alice.fundABiz.setBusinessAddress(treasury_account.address))
        .to.be.rejected; //With("AccessControl");
    });

    it("allows only manager to setFundingTiersAndCosts", async () => {
      await expect(
        //@ts-ignore
        alice.fundABiz.setFundingTiersAndCosts(FUNDERS_TIERS_AND_COST)
      ).to.be.rejected; //With("AccessControl");
    });

    it("allows only manager to setTargetAmounts", async () => {
      await expect(alice.fundABiz.setTargetAmounts(AMOUNTS_TO_BE_RAISED)).to.be
        .rejected; //With("AccessControl");
    });

    it("allows only manager to setCampaignAndDecisionPeriod", async () => {
      await expect(alice.fundABiz.setCampaignAndDecisionPeriod(CAMPAIGN_PERIOD))
        .to.be.rejected; //With("AccessControl");
    });

    it("allows only manager to setMilestones", async () => {
      await expect(
        //@ts-ignore
        alice.fundABiz.setMilestones(MILESTONE_SCHEDULE)
      ).to.be.rejected; //With("AccessControl");
    });

    it("allows only manager to setMOATFee", async () => {
      await expect(alice.fundABiz.setMOATFee(MOAT_FEE_NUMERATOR)).to.be
        .rejected; //With("AccessControl");
    });

    it("does not allow setting FundingTiersAndCosts after campaign has started", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await expect(
        //@ts-ignore
        deployer.fundABiz.setFundingTiersAndCosts(FUNDERS_TIERS_AND_COST)
      ).to.be.rejected; //With("TooLateToChange()");
    });

    it("does not allow changing MOATFee after campaign has started", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await expect(deployer.fundABiz.setMOATFee(MOAT_FEE_NUMERATOR)).to.be
        .rejected; //With("TooLateToChange()");
    });

    it("does not allow changing the targetAmounts after decision time has passed", async () => {
      // movetime to when decision time has passed
      await moveTime(63936000);
      await expect(deployer.fundABiz.setTargetAmounts(AMOUNTS_TO_BE_RAISED)).to
        .be.rejected; //With("TooLateToChange()");
    });
  });
});
