import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  ONE,
  nftPerksAddresses,
  TIERS_SYMBOLS,
  TIERS_NAMES,
  TIERS_MAX_SUPPLIES,
  TOKEN_URIS,
  ROYALTY_FEE,
  ERC20_AMOUNT,
} from "../utils/constants";
import {
  NftPerks as NftPerksType,
  IERC165__factory as IERC165Factory,
  IAccessControl__factory as IAccessControlFactory,
} from "../types";
import {
  getInterfaceID,
  getInterfaceIDArray,
  setupUser,
} from "../utils/helper-functions";
import { IAccessControlInterface } from "../types/@openzeppelin/contracts/access/IAccessControl";
import { IERC165Interface } from "../types/@openzeppelin/contracts/utils/introspection/IERC165";

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
    nftTierContract: <NftPerksType>(
      await ethers.getContractAt("NftPerks", nftPerksAddresses[0])
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
  nftTierContract: NftPerksType;
};
describe("NftPerks Unit Tests", function () {
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
    treasury_account: TestAccount,
    nftTierContract: NftPerksType;

  beforeEach("Set up accounts and contract", async () => {
    ({
      deployer,
      treasury_account,
      alice,
      bob,
      charlie,
      dave,
      erin,
      nftTierContract,
    } = await setup());
    accounts = await ethers.getSigners();
    funders = [alice, bob, charlie, dave, erin];
    quantities = [10, 5, 5, 10, 7];
    fundersAddresses = funders.map((x) => x.address);
  });

  const OwnerOf = async (_id: number): Promise<string> => {
    return await nftTierContract.ownerOf(_id);
  };
  const mintNftToAccounts = async (
    users: string[],
    quantities: number[]
  ): Promise<void> => {
    for (let i = 0; i < users.length; i++) {
      const qnty = quantities[i];
      for (let j = 0; j < qnty; j++) {
        const tx: ContractTransaction = await deployer.nftTierContract.mintNft(
          users[i]
        );
        await tx.wait();
      }
    }
  };
  describe("constructor", function () {
    it("Check NftPerks is deployed", async () => {
      expect(nftTierContract.address).to.be.not.empty;
    });
    it("initiallizes TIERS_NAMES correctly", async () => {
      const tierName: string = await nftTierContract.name();
      assert.equal(tierName, TIERS_NAMES[0]);
    });
    it("initiallizes TIERS_SYMBOLS correctly", async () => {
      const tierSymbol: string = await nftTierContract.symbol();
      assert.equal(tierSymbol, TIERS_SYMBOLS[0]);
    });
    it("initiallizes maxSupply correctly", async () => {
      const maxSupply: number = Number(await nftTierContract.maxSupply());
      assert.equal(maxSupply, TIERS_MAX_SUPPLIES[0]);
    });
    it("initiallizes tokenUri correctly", async () => {
      await mintNftToAccounts(fundersAddresses, quantities);
      const tokenID: number = Number(await nftTierContract.tokenId()) - 1;
      const newUri: string = await nftTierContract.tokenURI(tokenID);
      assert.equal(newUri, TOKEN_URIS[0]);
    });
  });
  describe("mintNft function", function () {
    it("allows Minter to mint Nft ", async () => {
      const tx1: ContractTransaction = await deployer.nftTierContract.mintNft(
        alice.address
      );
      await tx1.wait();
      const tokenID: number = Number(await nftTierContract.tokenId()) - 1;
      const owner: string = await OwnerOf(tokenID);
      assert.equal(alice.address, owner);
    });

    it("reverts if maxSupply has been reached", async () => {
      for (let i = 0; i < TIERS_MAX_SUPPLIES[0]; i++) {
        const tx: ContractTransaction = await deployer.nftTierContract.mintNft(
          erin.address
        );
        await tx.wait();
      }
      await expect(
        deployer.nftTierContract.mintNft(alice.address)
      ).to.rejectedWith("MaxSupplyReached()");
    });

    it("allows only Minter to mint Nft", async () => {
      await expect(
        charlie.nftTierContract.mintNft(alice.address)
      ).to.rejectedWith("AccessControl");
    });

    it("allows to change Minter Role", async () => {
      // change the minter role;
      const minter = await nftTierContract.MINTER_ROLE();
      const tx: ContractTransaction = await deployer.nftTierContract.grantRole(
        minter,
        charlie.address
      );
      await tx.wait();
      // Revoke the default Admin role
      const adminRole = await nftTierContract.DEFAULT_ADMIN_ROLE();
      const revokeTx = await deployer.nftTierContract.revokeRole(
        adminRole,
        deployer.address
      );
      await revokeTx.wait();
      const tx1: ContractTransaction = await charlie.nftTierContract.mintNft(
        alice.address
      );
      await tx1.wait();
      const tokenID: number = Number(await nftTierContract.tokenId()) - 1;
      const owner: string = await OwnerOf(tokenID);
      assert.equal(alice.address, owner);
      const renounceTx = await deployer.nftTierContract.renounceRole(
        minter,
        deployer.address
      );
      await renounceTx.wait();
      expect(await nftTierContract.hasRole(minter, deployer.address)).to.be
        .false;
      await expect(
        deployer.nftTierContract.mintNft(alice.address)
      ).to.rejectedWith("AccessControl");
    });

    it("emits NFTMinted event", async () => {
      const tokenID: number = Number(await nftTierContract.tokenId());
      await expect(deployer.nftTierContract.mintNft(alice.address))
        .to.emit(nftTierContract, "NFTMinted")
        .withArgs(tokenID, alice.address);
    });
  });
  describe("setRoyalties function", function () {
    it("allows manager setRoyalties", async () => {
      const tx: ContractTransaction =
        await deployer.nftTierContract.setRoyalties(
          treasury_account.address,
          ROYALTY_FEE
        );
      await tx.wait();

      const royalty_info = await nftTierContract.royaltyInfo(
        ERC20_AMOUNT,
        ERC20_AMOUNT
      );
      const calc_amount: BigNumber = ONE.mul((10 ** 4 * ROYALTY_FEE) / 10 ** 5);
      const { receiver, royaltyAmount } = royalty_info;
      assert.equal(receiver, treasury_account.address);
      assert.equal(royaltyAmount.toString(), calc_amount.toString());
    });
    it("allows only manager to setRoyalties", async () => {
      await expect(
        bob.nftTierContract.setRoyalties(treasury_account.address, ROYALTY_FEE)
      ).to.rejectedWith("AccessControl");
    });
    it("rejects invalid values", async () => {
      const invalidFee = 10 ** 6;
      await expect(
        deployer.nftTierContract.setRoyalties(
          treasury_account.address,
          invalidFee
        )
      ).to.rejectedWith("InvalidValue()");
    });
  });
  describe("supportsInterface function", function () {
    it("Supports IAccessControl interface", async () => {
      const IAccessControl: IAccessControlInterface =
        IAccessControlFactory.createInterface();
      const interfaceID: BigNumber = getInterfaceID(IAccessControl);
      expect(await nftTierContract.supportsInterface(interfaceID._hex)).to.be
        .true;
    });
    it("Supports IERC165 interface", async () => {
      const IERC165: IERC165Interface = IERC165Factory.createInterface();
      const interfaceID: BigNumber = getInterfaceID(IERC165);
      expect(await nftTierContract.supportsInterface(interfaceID._hex)).to.be
        .true;
    });
    it("Doesn't support random interface", async () => {
      const IExample: Array<string> = ["example(address,uint256)"];
      const interfaceID: BigNumber = getInterfaceIDArray(IExample);
      expect(await nftTierContract.supportsInterface(interfaceID._hex)).to.be
        .false;
    });
  });
});
