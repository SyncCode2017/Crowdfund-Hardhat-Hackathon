/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IFundABusiness,
  IFundABusinessInterface,
} from "../../../contracts/interfaces/IFundABusiness";

const _abi = [
  {
    inputs: [],
    name: "AlreadyApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "CampaignEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "CampaignNotOpen",
    type: "error",
  },
  {
    inputs: [],
    name: "CampaignUnsuccessful",
    type: "error",
  },
  {
    inputs: [],
    name: "DecisionMade",
    type: "error",
  },
  {
    inputs: [],
    name: "FractionTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "FunderHasClaimedNft",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTier",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTierAndQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidValues",
    type: "error",
  },
  {
    inputs: [],
    name: "NeedMoreTokens",
    type: "error",
  },
  {
    inputs: [],
    name: "NftTokensNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "NoFundDue",
    type: "error",
  },
  {
    inputs: [],
    name: "NoRefund",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAFunder",
    type: "error",
  },
  {
    inputs: [],
    name: "NotReceivingFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "NotTheOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "ReleasingMoreThanFundRaised",
    type: "error",
  },
  {
    inputs: [],
    name: "TooLateToChange",
    type: "error",
  },
  {
    inputs: [],
    name: "TransactionFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "Undecided",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "CampaignFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "CampaignSuccessful",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "funder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tier",
        type: "uint256",
      },
    ],
    name: "ContributionReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "funder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tier",
        type: "uint256",
      },
    ],
    name: "ContributionRefunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "business",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "FundReleased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "funder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tier",
        type: "uint256",
      },
    ],
    name: "NFTRewardClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_milestoneNumber",
        type: "uint256",
      },
    ],
    name: "approveMilestoneAndReleaseFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "claimNft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_funder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "claimNftFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "claimRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_funder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "claimRefundFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IFundABusiness.EndCampaign",
        name: "_reasonForEnding",
        type: "uint8",
      },
    ],
    name: "closeFundingRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_funder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "contributeOnBehalfOf",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBusinessBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFundersAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "getOneNativeCoinRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "getQuantityOfTierBought",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "getTierPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_businessAddress",
        type: "address",
      },
    ],
    name: "setBusinessAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_campaignTimesAndDecision",
        type: "uint256[]",
      },
    ],
    name: "setCampaignAndDecisionPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "fundingTier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tierCost",
            type: "uint256",
          },
        ],
        internalType: "struct IFundABusiness.FundingTierCost[]",
        name: "_fundingTiers",
        type: "tuple[]",
      },
    ],
    name: "setFundingTiersAndCosts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeFraction",
        type: "uint256",
      },
    ],
    name: "setMOATFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "milestoneNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fractionToBeReleased",
            type: "uint256",
          },
        ],
        internalType: "struct IFundABusiness.MilestoneStruct[]",
        name: "_milestonesData",
        type: "tuple[]",
      },
    ],
    name: "setMilestones",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "fundingTier",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftTokenAddress",
            type: "address",
          },
        ],
        internalType: "struct IFundABusiness.NftTierContract[]",
        name: "_nftTierContracts",
        type: "tuple[]",
      },
    ],
    name: "setNftPerkContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_amountsToBeRaised",
        type: "uint256[]",
      },
    ],
    name: "setTargetAmounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_treasuryAddress",
        type: "address",
      },
    ],
    name: "setTreasuryAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFundRaised",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IFundABusiness__factory {
  static readonly abi = _abi;
  static createInterface(): IFundABusinessInterface {
    return new utils.Interface(_abi) as IFundABusinessInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFundABusiness {
    return new Contract(address, _abi, signerOrProvider) as IFundABusiness;
  }
}
