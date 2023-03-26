import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  ONE,
  nftTiersAddresses,
  TIERS,
  TIER1_PRICE,
  TIER2_PRICE,
  TIER3_PRICE,
  CROWDDIT_FEE_FRACTION,
  AMOUNTS_TO_BE_RAISED,
  ADDRESS_ZERO,
  FUNDERS_TIERS_AND_COST,
  MILESTONE_SCHEDULE,
  CAMPAIGN_PERIOD,
} from "../utils/constants";
import {
  MockERC20 as MockERC20Type,
  BasicNft as BasicNftType,
  FundABusiness as FundABusinessType,
} from "../types";
import setNftContracts from "../deploy/02-set-tier-contracts";
import { setupUser } from "../utils/helper-functions";
import { moveTime } from "../utils/move-time";

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
    mockErc20: <MockERC20Type>await ethers.getContract("MockERC20"),
    nftTier1Contract: <BasicNftType>(
      await ethers.getContractAt("BasicNft", nftTiersAddresses[0])
    ),
    nftTier2Contract: <BasicNftType>(
      await ethers.getContractAt("BasicNft", nftTiersAddresses[1])
    ),
    nftTier3Contract: <BasicNftType>(
      await ethers.getContractAt("BasicNft", nftTiersAddresses[2])
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

type TestAccount = {
  address: string;
  signer: SignerWithAddress;
} & {
  fundABiz: FundABusinessType;
  mockErc20: MockERC20Type;
  nftTier1Contract: BasicNftType;
  nftTier2Contract: BasicNftType;
  nftTier3Contract: BasicNftType;
};
async function getAccountBalances(
  accounts: string[],
  token: MockERC20Type
): Promise<number[]> {
  let accountsBalances: number[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const balanceWei = (await token.balanceOf(accounts[i])).toString();
    const balanceEth = ethers.utils.formatEther(balanceWei);
    accountsBalances.push(Number(balanceEth));
  }
  return accountsBalances;
}
async function crowdFundABiz(funders: TestAccount[], quantities: number[]) {
  for (let i = 0; i < funders.length; i++) {
    const tx1: ContractTransaction = await funders[i].fundABiz.contribute(
      TIERS[0],
      quantities[i]
    );
    await tx1.wait();
    const tx2: ContractTransaction = await funders[i].fundABiz.contribute(
      TIERS[1],
      quantities[i]
    );
    await tx2.wait();
    const tx3: ContractTransaction = await funders[i].fundABiz.contribute(
      TIERS[2],
      quantities[i]
    );
    await tx3.wait();
  }
  console.log("Business crowd-funded!");
}

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
    amounts: number[],
    fundABiz: FundABusinessType,
    mockErc20: MockERC20Type,
    business_account: TestAccount,
    treasury_account: TestAccount,
    nftTier1Contract: BasicNftType,
    nftTier2Contract: BasicNftType,
    nftTier3Contract: BasicNftType;

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
      mockErc20,
      fundABiz,
      nftTier1Contract,
      nftTier2Contract,
      nftTier3Contract,
    } = await setup());
    accounts = await ethers.getSigners();
    funders = [alice, bob, charlie, dave, erin];
    quantities = [10, 5, 5, 10, 7];
    amounts = [
      10 * 100 + 10 * 200 + 10 * 300,
      5 * 100 + 5 * 200 + 5 * 300,
      5 * 100 + 5 * 200 + 5 * 300,
      10 * 100 + 10 * 200 + 10 * 300,
      7 * 100 + 7 * 200 + 7 * 300,
    ];
    const deployerTokAmount: BigNumber = ONE.mul(100000);
    fundersAddresses = funders.map((x) => x.address);
    // Mint mockErc20 to deployer
    const txMint: ContractTransaction = await deployer.mockErc20.mint(
      deployer.address,
      deployerTokAmount
    );
    await txMint.wait();
    // Approve deployertokens for fundAbiz
    const txDepApp: ContractTransaction = await deployer.mockErc20.approve(
      fundABiz.address,
      deployerTokAmount
    );
    await txDepApp.wait();

    // Set approval for mockErc20 spending
    for (let i = 0; i < funders.length; i++) {
      const txApproval: ContractTransaction = await funders[
        i
      ].mockErc20.approve(
        fundABiz.address,
        ethers.utils.parseEther((2 * amounts[i]).toString())
      );
      await txApproval.wait();
    }
  });

  describe("constructor", function () {
    it("Check FundABusiness is deployed", async () => {
      expect(fundABiz.address).to.be.not.empty;
    });
    it("initiallizes allowedErc20Token correctly", async () => {
      const allowedToken: string = await fundABiz.allowedErc20Token();
      assert.equal(allowedToken, mockErc20.address);
    });
    it("initiallizes businessAddress correctly", async () => {
      const businessAddress: string = await fundABiz.businessAddress();
      assert.equal(businessAddress, business_account.address);
    });
    it("initiallizes crowdditFeeFraction correctly", async () => {
      const feeFraction = Number(await fundABiz.crowdditFeeFraction());
      assert.equal(feeFraction, CROWDDIT_FEE_FRACTION);
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
      }
      checkArrayElements(tierCosts, expectedTierPrices);
    });
  });
  describe("contributeOnBehalfOf and contribute functions", function () {
    it("allows funders to contribute whenNotPaused and campaign is open", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const initialBals: number[] = await getAccountBalances(
        fundersAddresses,
        mockErc20
      );
      await crowdFundABiz(funders, quantities);
      const finalBals: number[] = await getAccountBalances(
        fundersAddresses,
        mockErc20
      );
      const currentFunders: string[] =
        await deployer.fundABiz.getFundersAddresses();

      checkArrayElements(currentFunders, fundersAddresses);

      for (let i = 0; i < amounts.length; i++) {
        assert.equal(initialBals[i] - finalBals[i], amounts[i]);
      }
    });
    it("rejects contribution when campaign is not open", async () => {
      // movetime to when campaign has closed
      await moveTime(60480000);
      const quantity = 1;
      await expect(
        alice.fundABiz.contribute(TIERS[0], quantity)
      ).to.be.rejectedWith("CampaignNotOpen()");
    });
    it("rejects contribution when contract is paused", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const quantity = 5;
      const tx = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(
        alice.fundABiz.contribute(TIERS[0], quantity)
      ).to.be.revertedWith("Pausable: paused");
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
      await expect(alice.fundABiz.contribute(TIERS[0], quantity))
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
      // CROWDDIT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        1
      );
      await tx.wait();
      const initialBals: number[] = await getAccountBalances(
        fundersAddresses,
        mockErc20
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
        mockErc20
      );
      for (let i = 0; i < amounts.length; i++) {
        assert.equal(finalBals[i] - initialBals[i], amounts[i]);
      }
    });
    it("rejects claiming refund when campaign succeeds", async () => {
      // CROWDDIT decides to close the campaign due to TARGETMET
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        0
      );
      await tx.wait();
      for (let i = 0; i < funders.length; i++) {
        await expect(
          funders[i].fundABiz.claimRefund(TIERS[0])
        ).to.be.rejectedWith("NoRefund()");
        await expect(
          funders[i].fundABiz.claimRefund(TIERS[1])
        ).to.be.rejectedWith("NoRefund()");
        await expect(
          funders[i].fundABiz.claimRefund(TIERS[2])
        ).to.be.rejectedWith("NoRefund()");
      }
    });
    it("rejects claiming refund when caller is not a funder", async () => {
      await moveTime(1000);
      // CROWDDIT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        1
      );
      await tx.wait();
      await expect(deployer.fundABiz.claimRefund(TIERS[2])).to.be.rejectedWith(
        "NotAFunder()"
      );
    });
    it("rejects claiming refund when contract is paused", async () => {
      // CROWDDIT decides to close the campaign due to TARGETMET
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        0
      );
      await tx.wait();
      // pause the contract
      const tx1 = await deployer.fundABiz.pause();
      await tx1.wait();
      for (let i = 0; i < funders.length; i++) {
        await expect(
          funders[i].fundABiz.claimRefund(TIERS[0])
        ).to.be.rejectedWith("Pausable: paused");
        await expect(
          funders[i].fundABiz.claimRefund(TIERS[1])
        ).to.be.rejectedWith("Pausable: paused");
        await expect(
          funders[i].fundABiz.claimRefund(TIERS[2])
        ).to.be.rejectedWith("Pausable: paused");
      }
    });
    it("emits ContributionRefunded", async () => {
      await moveTime(1000);
      // CROWDDIT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        1
      );
      await tx.wait();
      await expect(bob.fundABiz.claimRefund(TIERS[2]))
        .to.emit(fundABiz, "ContributionRefunded")
        .withArgs(bob.address, TIERS[2]);
    });
  });
  describe("fiatContributeOnBehalfOf test function", function () {
    it("allows manager role to deposit on behalf of fiat funders", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const initialBals: number[] = await getAccountBalances(
        [deployer.address],
        mockErc20
      );
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await deployer.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      const tx: ContractTransaction =
        await deployer.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        );
      await tx.wait();
      const finalBals: number[] = await getAccountBalances(
        [deployer.address],
        mockErc20
      );
      const currentFunders: string[] =
        await deployer.fundABiz.getFundersAddresses();

      checkArrayElements(currentFunders, fundersAddresses);
      assert.equal(initialBals[0] - finalBals[0], totalAmountInEth);
    });
    it("allows only manager role to deposit on behalf of fiat funders", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await bob.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      await expect(
        bob.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        )
      ).to.be.rejectedWith("AccessControl");
    });
    it("rejects deposit when made outside campaign start time and campaign decision time window", async () => {
      // movetime to when campaign has started
      await moveTime(1000);
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await deployer.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      await expect(
        deployer.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        )
      ).to.be.rejectedWith("NotReceivingFunds()");
    });
    it("rejects deposit when contract is paused", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await deployer.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      // pause the contract
      const tx1 = await deployer.fundABiz.pause();
      await tx1.wait();
      await expect(
        deployer.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        )
      ).to.be.rejectedWith("Pausable: paused");
    });
    it("rejects deposit when arrays of unequal lengths are entered", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await deployer.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      await expect(
        deployer.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        )
      ).to.be.rejectedWith("InvalidValues()");
    });
    it("emits FiatContributionReceived", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await deployer.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      await expect(
        deployer.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        )
      )
        .to.emit(fundABiz, "FiatContributionReceived")
        .withArgs(deployer.address, totalAmountInWei);
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
      await setNftContracts();

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
        const lastTokenIdTier1 =
          Number(await nftTier1Contract.getTokenCounter()) - 1;
        const lastTokenIdTier2 =
          Number(await nftTier2Contract.getTokenCounter()) - 1;
        const lastTokenIdTier3 =
          Number(await nftTier3Contract.getTokenCounter()) - 1;
        assert.equal(
          await funders[i].fundABiz.isOwnerOf(TIERS[0], lastTokenIdTier1),
          true
        );
        assert.equal(
          await funders[i].fundABiz.isOwnerOf(TIERS[1], lastTokenIdTier2),
          true
        );
        assert.equal(
          await funders[i].fundABiz.isOwnerOf(TIERS[2], lastTokenIdTier3),
          true
        );
      }
    });
    it("rejects non-funders from claiming NFT", async () => {
      await moveTime(31968000);
      await setNftContracts();

      await expect(deployer.fundABiz.claimNft(TIERS[1])).to.be.rejectedWith(
        "NotAFunder()"
      );
    });
    it("rejects NFT claiming when contract is paused", async () => {
      await moveTime(31968000);
      await setNftContracts();
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejectedWith(
        "Pausable: paused"
      );
    });
    it("rejects NFT claiming when NFT contracts are not set", async () => {
      await moveTime(31968000);
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejectedWith(
        "NftTokensNotSet()"
      );
    });
    it("rejects NFT claiming when campaign is unsuccesful", async () => {
      await setNftContracts();
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        1
      );
      await tx.wait();
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejectedWith(
        "CampaignUnsuccessful()"
      );
    });
    it("rejects NFT claiming when NFT has been claimed", async () => {
      await moveTime(31968000);
      await setNftContracts();
      const tx: ContractTransaction = await dave.fundABiz.claimNft(TIERS[1]);
      await tx.wait();
      await expect(dave.fundABiz.claimNft(TIERS[1])).to.be.rejectedWith(
        "FunderHasClaimedNft()"
      );
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
        mockErc20
      );
      const tx1: ContractTransaction =
        await business_account.fundABiz.withdrawFundRaised();
      await tx1.wait();
      const netFundRaisedWei = (await fundABiz.fundRaisedMinusFee()).toString();
      const amountReleased =
        Number(ethers.utils.formatEther(netFundRaisedWei)) * milestoneData[1];
      const finalBals: number[] = await getAccountBalances(
        [business_account.address],
        mockErc20
      );
      assert.equal(finalBals[0] - initialBals[0], amountReleased);
    });
    it("reject withdrawal when no fund is due", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      await expect(
        business_account.fundABiz.withdrawFundRaised()
      ).to.be.rejectedWith("NoFundDue()");
    });
    it("rejects withdrawal when contract is paused", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await expect(
        business_account.fundABiz.withdrawFundRaised()
      ).to.be.rejectedWith("Pausable: paused");
    });
    it("rejects withdrawal when campaign is unsuccesful", async () => {
      await moveTime(1000);
      // CROWDDIT decides to close the campaign due to FAILURE
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        1
      );
      await tx.wait();
      await expect(
        business_account.fundABiz.withdrawFundRaised()
      ).to.be.rejectedWith("CampaignUnsuccessful()");
    });
    it("allows only businessAddress to withdraw", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      await expect(deployer.fundABiz.withdrawFundRaised()).to.be.rejectedWith(
        "NotTheOwner()"
      );
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
      const TARGETMET = 0;
      const initialBals: number[] = await getAccountBalances(
        [treasury_account.address],
        mockErc20
      );
      // CROWDDIT decides to close the campaign due to TARGETMET
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        TARGETMET
      );
      await tx.wait();
      const finalBals: number[] = await getAccountBalances(
        [treasury_account.address],
        mockErc20
      );
      expect(finalBals[0]).to.be.greaterThan(initialBals[0]);
      const quantity = 10;
      await expect(
        erin.fundABiz.contribute(TIERS[1], quantity)
      ).to.be.rejectedWith("CampaignNotOpen()");
    });
    it("allows manager role to close funding round when contract is paused", async () => {
      const tx: ContractTransaction = await deployer.fundABiz.pause();
      await tx.wait();
      await moveTime(1000);
      const TARGETMET = 0;
      const tx1: ContractTransaction =
        await deployer.fundABiz.closeFundingRound(TARGETMET);
      await tx1.wait();
      const tx2: ContractTransaction = await deployer.fundABiz.unpause();
      await tx2.wait();
      const quantity = 10;
      await expect(
        erin.fundABiz.contribute(TIERS[1], quantity)
      ).to.be.rejectedWith("CampaignNotOpen()");
    });
    it("allows only manager role to close funding round", async () => {
      await moveTime(1000);
      await expect(bob.fundABiz.closeFundingRound(1)).to.be.rejectedWith(
        "AccessControl"
      );
    });
    it("rejects funding round closure for invalid reason", async () => {
      await moveTime(1000);
      await expect(bob.fundABiz.closeFundingRound(2)).to.be.rejected;
    });
  });
  describe("isOwnerOf function", function () {
    beforeEach("Crowd fund a business", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await crowdFundABiz(funders, quantities);
    });
    it("correctly confirms the owner of an NFT perk", async () => {
      await moveTime(31968000);
      await setNftContracts();

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
        const lastTokenIdTier1 =
          Number(await nftTier1Contract.getTokenCounter()) - 1;
        const lastTokenIdTier2 =
          Number(await nftTier2Contract.getTokenCounter()) - 1;
        const lastTokenIdTier3 =
          Number(await nftTier3Contract.getTokenCounter()) - 1;
        assert.equal(
          await funders[i].fundABiz.isOwnerOf(TIERS[0], lastTokenIdTier1),
          true
        );
        assert.equal(
          await funders[i].fundABiz.isOwnerOf(TIERS[1], lastTokenIdTier2),
          true
        );
        assert.equal(
          await funders[i].fundABiz.isOwnerOf(TIERS[2], lastTokenIdTier3),
          true
        );
        assert.equal(
          await deployer.fundABiz.isOwnerOf(TIERS[0], lastTokenIdTier1),
          false
        );
        assert.equal(
          await business_account.fundABiz.isOwnerOf(TIERS[1], lastTokenIdTier2),
          false
        );
        assert.equal(
          await treasury_account.fundABiz.isOwnerOf(TIERS[2], lastTokenIdTier3),
          false
        );
      }
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
      assert.equal(businessBal, amountReleased);
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
      // fiat contribution
      const totalAmountInEth = 100 * 37;
      const totalAmountInWei = ONE.mul(totalAmountInEth);
      const txApproval = await deployer.mockErc20.approve(
        fundABiz.address,
        totalAmountInWei
      );
      await txApproval.wait();
      const tx1: ContractTransaction =
        await deployer.fundABiz.fiatContributeOnBehalfOf(
          fundersAddresses,
          [TIERS[0], TIERS[0], TIERS[0], TIERS[0], TIERS[0]],
          quantities,
          totalAmountInWei
        );
      await tx1.wait();
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
        mockErc20
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
      ).to.be.rejectedWith("Pausable: paused");
    });
    it("allows only Manager role to approve milestone", async () => {
      // movetime to when campaign has closed
      await moveTime(31968000);
      const milestoneData = [0, 0.2];
      await expect(
        dave.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejectedWith("AccessControl");
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
      ).to.be.rejectedWith("AlreadyApproved()");
    });
    it("does not allow approval if campaign fails", async () => {
      const FAILURE = 1;
      const tx: ContractTransaction = await deployer.fundABiz.closeFundingRound(
        FAILURE
      );
      await tx.wait();
      const milestoneData = [0, 0.2];
      await expect(
        deployer.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejectedWith("CampaignUnsuccessful()");
    });
    it("does not allow approval before campaign ends", async () => {
      const milestoneData = [0, 0.2];
      await expect(
        deployer.fundABiz.approveMilestoneAndReleaseFund(milestoneData[0])
      ).to.be.rejectedWith("Undecided()");
    });
  });
  describe("setters function", function () {
    it("allows only manager to setAllowedToken ", async () => {
      await moveTime(1000);
      await expect(
        bob.fundABiz.setAllowedToken(mockErc20.address)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setNftPerkContracts ", async () => {
      const TIERS_AND_NFT_CONTRACTS: [number, string][] = [
        [TIERS[0], nftTiersAddresses[0]],
        [TIERS[1], nftTiersAddresses[1]],
        [TIERS[2], nftTiersAddresses[2]],
      ];
      await expect(
        bob.fundABiz.setNftPerkContracts(TIERS_AND_NFT_CONTRACTS)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setTreasuryAddress", async () => {
      await expect(
        alice.fundABiz.setTreasuryAddress(business_account.address)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setBusinessAddress", async () => {
      await expect(
        alice.fundABiz.setBusinessAddress(treasury_account.address)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setFundingTiersAndCosts", async () => {
      await expect(
        alice.fundABiz.setFundingTiersAndCosts(FUNDERS_TIERS_AND_COST)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setTargetAmounts", async () => {
      await expect(
        alice.fundABiz.setTargetAmounts(AMOUNTS_TO_BE_RAISED)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setCampaignAndDecisionPeriod", async () => {
      await expect(
        alice.fundABiz.setCampaignAndDecisionPeriod(CAMPAIGN_PERIOD)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setMilestones", async () => {
      await expect(
        alice.fundABiz.setMilestones(MILESTONE_SCHEDULE)
      ).to.be.rejectedWith("AccessControl");
    });
    it("allows only manager to setCrowdditFee", async () => {
      await expect(
        alice.fundABiz.setCrowdditFee(CROWDDIT_FEE_FRACTION)
      ).to.be.rejectedWith("AccessControl");
    });
    it("does not allow setting FundingTiersAndCosts after campaign has started", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await expect(
        deployer.fundABiz.setFundingTiersAndCosts(FUNDERS_TIERS_AND_COST)
      ).to.be.rejectedWith("TooLateToChange()");
    });
    it("does not allow changing CrowdditFee after campaign has started", async () => {
      // movetime to when campaign has started
      await moveTime(31968000);
      await expect(
        deployer.fundABiz.setCrowdditFee(CROWDDIT_FEE_FRACTION)
      ).to.be.rejectedWith("TooLateToChange()");
    });
    it("does not allow changing the targetAmonts after decision time has passed", async () => {
      // movetime to when decision time has passed
      await moveTime(63936000);
      await expect(
        deployer.fundABiz.setTargetAmounts(AMOUNTS_TO_BE_RAISED)
      ).to.be.rejectedWith("TooLateToChange()");
    });
  });
});
