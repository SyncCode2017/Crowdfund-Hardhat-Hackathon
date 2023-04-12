import { ethers, getNamedAccounts, network } from "hardhat";
import {
  MOAT_WALLETS,
  ONE,
  TIERS,
  developmentChains,
} from "../utils/constants";
import {
  MockERC20 as MockERC20Type,
  FundABusiness as FundABusinessType,
} from "../types";
import { ContractTransaction } from "ethers";
import { getAccountBalances } from "../utils/helper-functions";

async function main(): Promise<void> {
  let fundersAddresses: string[], quantities: number[], totalAmountInEth;
  const { deployer, alice, bob, charlie, dave, erin } =
    await getNamedAccounts();

  // Getting the contracts
  const mockErc20: MockERC20Type = await ethers.getContract(
    "MockERC20",
    deployer
  );
  const fundABiz: FundABusinessType = await ethers.getContract(
    "FundABusiness",
    deployer
  );

  // Getting the fiat funders
  if (developmentChains.includes(network.name)) {
    fundersAddresses = [alice, bob, charlie, dave, erin];
    quantities = [10, 5, 5, 10, 7];
    totalAmountInEth = 100 * 37;
  } else {
    if (MOAT_WALLETS.length === 0) {
      throw new Error("MOAT_WALLETS cannot be empty");
      process.exit(1);
    }
    fundersAddresses = MOAT_WALLETS;
    quantities = [10, 10, 10, 10, 10];
    totalAmountInEth = 300 * 50;
  }

  const initialBals: number[] = await getAccountBalances([deployer], mockErc20);
  console.log(`The manager initial token balance is ${initialBals[0]}`);

  const totalAmountInWei = ONE.mul(totalAmountInEth);
  // Approving Erc-20 token for the FundABusiness Contract
  const txApproval = await mockErc20.approve(
    fundABiz.address,
    totalAmountInWei
  );
  await txApproval.wait();
  const tx: ContractTransaction = await fundABiz.fiatContributeOnBehalfOf(
    fundersAddresses,
    [TIERS[2], TIERS[2], TIERS[2], TIERS[2], TIERS[2]],
    quantities,
    totalAmountInWei
  );
  await tx.wait();
  const finalBals: number[] = await getAccountBalances([deployer], mockErc20);
  console.log(`The manager final token balance is ${finalBals[0]}`);
  const currentFunders: string[] = await fundABiz.getFundersAddresses();
  console.log(`The current funders are ${currentFunders}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
