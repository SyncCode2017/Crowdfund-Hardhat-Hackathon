/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace IFundABusiness {
  export type FundingTierCostStruct = {
    fundingTier: PromiseOrValue<BigNumberish>;
    tierCost: PromiseOrValue<BigNumberish>;
  };

  export type FundingTierCostStructOutput = [BigNumber, BigNumber] & {
    fundingTier: BigNumber;
    tierCost: BigNumber;
  };

  export type MilestoneStructStruct = {
    milestoneNumber: PromiseOrValue<BigNumberish>;
    fractionToBeReleased: PromiseOrValue<BigNumberish>;
  };

  export type MilestoneStructStructOutput = [BigNumber, BigNumber] & {
    milestoneNumber: BigNumber;
    fractionToBeReleased: BigNumber;
  };

  export type NftTierContractStruct = {
    fundingTier: PromiseOrValue<BigNumberish>;
    nftTokenAddress: PromiseOrValue<string>;
  };

  export type NftTierContractStructOutput = [BigNumber, string] & {
    fundingTier: BigNumber;
    nftTokenAddress: string;
  };
}

export interface IFundABusinessInterface extends utils.Interface {
  functions: {
    "approveMilestoneAndReleaseFund(uint256)": FunctionFragment;
    "claimNft(uint256)": FunctionFragment;
    "claimNftFor(address,uint256)": FunctionFragment;
    "claimRefund(uint256)": FunctionFragment;
    "claimRefundFor(address,uint256)": FunctionFragment;
    "closeFundingRound(uint8)": FunctionFragment;
    "contribute(uint256,uint256)": FunctionFragment;
    "contributeOnBehalfOf(address,uint256,uint256)": FunctionFragment;
    "fiatContributeOnBehalfOf(address[],uint256[],uint256[],uint256)": FunctionFragment;
    "getBusinessBalance()": FunctionFragment;
    "getFundersAddresses()": FunctionFragment;
    "getQuantityOfTierBought(uint256)": FunctionFragment;
    "getTierPrice(uint256)": FunctionFragment;
    "isOwnerOf(uint256,uint256)": FunctionFragment;
    "setAllowedToken(address)": FunctionFragment;
    "setBusinessAddress(address)": FunctionFragment;
    "setCampaignAndDecisionPeriod(uint256[])": FunctionFragment;
    "setFundingTiersAndCosts((uint256,uint256)[])": FunctionFragment;
    "setMOATFee(uint256)": FunctionFragment;
    "setMilestones((uint256,uint256)[])": FunctionFragment;
    "setNftPerkContracts((uint256,address)[])": FunctionFragment;
    "setTargetAmounts(uint256[])": FunctionFragment;
    "setTreasuryAddress(address)": FunctionFragment;
    "withdrawFundRaised()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "approveMilestoneAndReleaseFund"
      | "claimNft"
      | "claimNftFor"
      | "claimRefund"
      | "claimRefundFor"
      | "closeFundingRound"
      | "contribute"
      | "contributeOnBehalfOf"
      | "fiatContributeOnBehalfOf"
      | "getBusinessBalance"
      | "getFundersAddresses"
      | "getQuantityOfTierBought"
      | "getTierPrice"
      | "isOwnerOf"
      | "setAllowedToken"
      | "setBusinessAddress"
      | "setCampaignAndDecisionPeriod"
      | "setFundingTiersAndCosts"
      | "setMOATFee"
      | "setMilestones"
      | "setNftPerkContracts"
      | "setTargetAmounts"
      | "setTreasuryAddress"
      | "withdrawFundRaised"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "approveMilestoneAndReleaseFund",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimNft",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimNftFor",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimRefund",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimRefundFor",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "closeFundingRound",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "contribute",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "contributeOnBehalfOf",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "fiatContributeOnBehalfOf",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getBusinessBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFundersAddresses",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getQuantityOfTierBought",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTierPrice",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isOwnerOf",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAllowedToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setBusinessAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setCampaignAndDecisionPeriod",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setFundingTiersAndCosts",
    values: [IFundABusiness.FundingTierCostStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setMOATFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMilestones",
    values: [IFundABusiness.MilestoneStructStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setNftPerkContracts",
    values: [IFundABusiness.NftTierContractStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setTargetAmounts",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setTreasuryAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFundRaised",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "approveMilestoneAndReleaseFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimNft", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimNftFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimRefund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimRefundFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "closeFundingRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "contribute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contributeOnBehalfOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fiatContributeOnBehalfOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBusinessBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFundersAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getQuantityOfTierBought",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTierPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isOwnerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAllowedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBusinessAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCampaignAndDecisionPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFundingTiersAndCosts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setMOATFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMilestones",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNftPerkContracts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTargetAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTreasuryAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFundRaised",
    data: BytesLike
  ): Result;

  events: {
    "CampaignFailed(uint256)": EventFragment;
    "CampaignSuccessful(uint256)": EventFragment;
    "ContributionReceived(address,uint256)": EventFragment;
    "ContributionRefunded(address,uint256)": EventFragment;
    "FiatContributionReceived(address,uint256)": EventFragment;
    "FundReleased(address,uint256,uint256)": EventFragment;
    "IsTheTrueOwner(address,uint256,uint256)": EventFragment;
    "NFTRewardClaimed(address,uint256)": EventFragment;
    "NotTheTrueOwner(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CampaignFailed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CampaignSuccessful"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContributionReceived"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContributionRefunded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FiatContributionReceived"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FundReleased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IsTheTrueOwner"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTRewardClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NotTheTrueOwner"): EventFragment;
}

export interface CampaignFailedEventObject {
  time: BigNumber;
}
export type CampaignFailedEvent = TypedEvent<
  [BigNumber],
  CampaignFailedEventObject
>;

export type CampaignFailedEventFilter = TypedEventFilter<CampaignFailedEvent>;

export interface CampaignSuccessfulEventObject {
  time: BigNumber;
}
export type CampaignSuccessfulEvent = TypedEvent<
  [BigNumber],
  CampaignSuccessfulEventObject
>;

export type CampaignSuccessfulEventFilter =
  TypedEventFilter<CampaignSuccessfulEvent>;

export interface ContributionReceivedEventObject {
  funder: string;
  tier: BigNumber;
}
export type ContributionReceivedEvent = TypedEvent<
  [string, BigNumber],
  ContributionReceivedEventObject
>;

export type ContributionReceivedEventFilter =
  TypedEventFilter<ContributionReceivedEvent>;

export interface ContributionRefundedEventObject {
  funder: string;
  tier: BigNumber;
}
export type ContributionRefundedEvent = TypedEvent<
  [string, BigNumber],
  ContributionRefundedEventObject
>;

export type ContributionRefundedEventFilter =
  TypedEventFilter<ContributionRefundedEvent>;

export interface FiatContributionReceivedEventObject {
  funder: string;
  amount: BigNumber;
}
export type FiatContributionReceivedEvent = TypedEvent<
  [string, BigNumber],
  FiatContributionReceivedEventObject
>;

export type FiatContributionReceivedEventFilter =
  TypedEventFilter<FiatContributionReceivedEvent>;

export interface FundReleasedEventObject {
  business: string;
  amount: BigNumber;
  time: BigNumber;
}
export type FundReleasedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  FundReleasedEventObject
>;

export type FundReleasedEventFilter = TypedEventFilter<FundReleasedEvent>;

export interface IsTheTrueOwnerEventObject {
  owner: string;
  tier: BigNumber;
  tokenId: BigNumber;
}
export type IsTheTrueOwnerEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  IsTheTrueOwnerEventObject
>;

export type IsTheTrueOwnerEventFilter = TypedEventFilter<IsTheTrueOwnerEvent>;

export interface NFTRewardClaimedEventObject {
  funder: string;
  tier: BigNumber;
}
export type NFTRewardClaimedEvent = TypedEvent<
  [string, BigNumber],
  NFTRewardClaimedEventObject
>;

export type NFTRewardClaimedEventFilter =
  TypedEventFilter<NFTRewardClaimedEvent>;

export interface NotTheTrueOwnerEventObject {
  caller: string;
  tier: BigNumber;
  tokenId: BigNumber;
}
export type NotTheTrueOwnerEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  NotTheTrueOwnerEventObject
>;

export type NotTheTrueOwnerEventFilter = TypedEventFilter<NotTheTrueOwnerEvent>;

export interface IFundABusiness extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IFundABusinessInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    approveMilestoneAndReleaseFund(
      _milestoneNumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimNft(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimNftFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimRefund(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimRefundFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    closeFundingRound(
      _reasonForEnding: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    contribute(
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    contributeOnBehalfOf(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    fiatContributeOnBehalfOf(
      _funders: PromiseOrValue<string>[],
      _tiers: PromiseOrValue<BigNumberish>[],
      _quantities: PromiseOrValue<BigNumberish>[],
      _totalAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getBusinessBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    getFundersAddresses(overrides?: CallOverrides): Promise<[string[]]>;

    getQuantityOfTierBought(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTierPrice(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isOwnerOf(
      _tier: PromiseOrValue<BigNumberish>,
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAllowedToken(
      _allowedErc20Token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setBusinessAddress(
      _businessAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setCampaignAndDecisionPeriod(
      _campaignTimesAndDecision: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFundingTiersAndCosts(
      _fundingTiers: IFundABusiness.FundingTierCostStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMOATFee(
      _feeFraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMilestones(
      _milestonesData: IFundABusiness.MilestoneStructStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setNftPerkContracts(
      _nftTierContracts: IFundABusiness.NftTierContractStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTargetAmounts(
      _amountsToBeRaised: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTreasuryAddress(
      _treasuryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawFundRaised(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  approveMilestoneAndReleaseFund(
    _milestoneNumber: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimNft(
    _tier: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimNftFor(
    _funder: PromiseOrValue<string>,
    _tier: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimRefund(
    _tier: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimRefundFor(
    _funder: PromiseOrValue<string>,
    _tier: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  closeFundingRound(
    _reasonForEnding: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  contribute(
    _tier: PromiseOrValue<BigNumberish>,
    _quantity: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  contributeOnBehalfOf(
    _funder: PromiseOrValue<string>,
    _tier: PromiseOrValue<BigNumberish>,
    _quantity: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  fiatContributeOnBehalfOf(
    _funders: PromiseOrValue<string>[],
    _tiers: PromiseOrValue<BigNumberish>[],
    _quantities: PromiseOrValue<BigNumberish>[],
    _totalAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getBusinessBalance(overrides?: CallOverrides): Promise<BigNumber>;

  getFundersAddresses(overrides?: CallOverrides): Promise<string[]>;

  getQuantityOfTierBought(
    _tier: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTierPrice(
    _tier: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isOwnerOf(
    _tier: PromiseOrValue<BigNumberish>,
    _tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAllowedToken(
    _allowedErc20Token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setBusinessAddress(
    _businessAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setCampaignAndDecisionPeriod(
    _campaignTimesAndDecision: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFundingTiersAndCosts(
    _fundingTiers: IFundABusiness.FundingTierCostStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMOATFee(
    _feeFraction: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMilestones(
    _milestonesData: IFundABusiness.MilestoneStructStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setNftPerkContracts(
    _nftTierContracts: IFundABusiness.NftTierContractStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTargetAmounts(
    _amountsToBeRaised: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTreasuryAddress(
    _treasuryAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawFundRaised(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approveMilestoneAndReleaseFund(
      _milestoneNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimNft(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimNftFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimRefund(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimRefundFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    closeFundingRound(
      _reasonForEnding: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    contribute(
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    contributeOnBehalfOf(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    fiatContributeOnBehalfOf(
      _funders: PromiseOrValue<string>[],
      _tiers: PromiseOrValue<BigNumberish>[],
      _quantities: PromiseOrValue<BigNumberish>[],
      _totalAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getBusinessBalance(overrides?: CallOverrides): Promise<BigNumber>;

    getFundersAddresses(overrides?: CallOverrides): Promise<string[]>;

    getQuantityOfTierBought(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTierPrice(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOwnerOf(
      _tier: PromiseOrValue<BigNumberish>,
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setAllowedToken(
      _allowedErc20Token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setBusinessAddress(
      _businessAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setCampaignAndDecisionPeriod(
      _campaignTimesAndDecision: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setFundingTiersAndCosts(
      _fundingTiers: IFundABusiness.FundingTierCostStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    setMOATFee(
      _feeFraction: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMilestones(
      _milestonesData: IFundABusiness.MilestoneStructStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    setNftPerkContracts(
      _nftTierContracts: IFundABusiness.NftTierContractStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    setTargetAmounts(
      _amountsToBeRaised: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setTreasuryAddress(
      _treasuryAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawFundRaised(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "CampaignFailed(uint256)"(time?: null): CampaignFailedEventFilter;
    CampaignFailed(time?: null): CampaignFailedEventFilter;

    "CampaignSuccessful(uint256)"(time?: null): CampaignSuccessfulEventFilter;
    CampaignSuccessful(time?: null): CampaignSuccessfulEventFilter;

    "ContributionReceived(address,uint256)"(
      funder?: null,
      tier?: null
    ): ContributionReceivedEventFilter;
    ContributionReceived(
      funder?: null,
      tier?: null
    ): ContributionReceivedEventFilter;

    "ContributionRefunded(address,uint256)"(
      funder?: null,
      tier?: null
    ): ContributionRefundedEventFilter;
    ContributionRefunded(
      funder?: null,
      tier?: null
    ): ContributionRefundedEventFilter;

    "FiatContributionReceived(address,uint256)"(
      funder?: null,
      amount?: null
    ): FiatContributionReceivedEventFilter;
    FiatContributionReceived(
      funder?: null,
      amount?: null
    ): FiatContributionReceivedEventFilter;

    "FundReleased(address,uint256,uint256)"(
      business?: null,
      amount?: null,
      time?: null
    ): FundReleasedEventFilter;
    FundReleased(
      business?: null,
      amount?: null,
      time?: null
    ): FundReleasedEventFilter;

    "IsTheTrueOwner(address,uint256,uint256)"(
      owner?: PromiseOrValue<string> | null,
      tier?: null,
      tokenId?: null
    ): IsTheTrueOwnerEventFilter;
    IsTheTrueOwner(
      owner?: PromiseOrValue<string> | null,
      tier?: null,
      tokenId?: null
    ): IsTheTrueOwnerEventFilter;

    "NFTRewardClaimed(address,uint256)"(
      funder?: null,
      tier?: null
    ): NFTRewardClaimedEventFilter;
    NFTRewardClaimed(funder?: null, tier?: null): NFTRewardClaimedEventFilter;

    "NotTheTrueOwner(address,uint256,uint256)"(
      caller?: PromiseOrValue<string> | null,
      tier?: null,
      tokenId?: null
    ): NotTheTrueOwnerEventFilter;
    NotTheTrueOwner(
      caller?: PromiseOrValue<string> | null,
      tier?: null,
      tokenId?: null
    ): NotTheTrueOwnerEventFilter;
  };

  estimateGas: {
    approveMilestoneAndReleaseFund(
      _milestoneNumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimNft(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimNftFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimRefund(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimRefundFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    closeFundingRound(
      _reasonForEnding: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    contribute(
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    contributeOnBehalfOf(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    fiatContributeOnBehalfOf(
      _funders: PromiseOrValue<string>[],
      _tiers: PromiseOrValue<BigNumberish>[],
      _quantities: PromiseOrValue<BigNumberish>[],
      _totalAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getBusinessBalance(overrides?: CallOverrides): Promise<BigNumber>;

    getFundersAddresses(overrides?: CallOverrides): Promise<BigNumber>;

    getQuantityOfTierBought(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTierPrice(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOwnerOf(
      _tier: PromiseOrValue<BigNumberish>,
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAllowedToken(
      _allowedErc20Token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setBusinessAddress(
      _businessAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setCampaignAndDecisionPeriod(
      _campaignTimesAndDecision: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFundingTiersAndCosts(
      _fundingTiers: IFundABusiness.FundingTierCostStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMOATFee(
      _feeFraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMilestones(
      _milestonesData: IFundABusiness.MilestoneStructStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setNftPerkContracts(
      _nftTierContracts: IFundABusiness.NftTierContractStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTargetAmounts(
      _amountsToBeRaised: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTreasuryAddress(
      _treasuryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawFundRaised(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveMilestoneAndReleaseFund(
      _milestoneNumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimNft(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimNftFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimRefund(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimRefundFor(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    closeFundingRound(
      _reasonForEnding: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    contribute(
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    contributeOnBehalfOf(
      _funder: PromiseOrValue<string>,
      _tier: PromiseOrValue<BigNumberish>,
      _quantity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    fiatContributeOnBehalfOf(
      _funders: PromiseOrValue<string>[],
      _tiers: PromiseOrValue<BigNumberish>[],
      _quantities: PromiseOrValue<BigNumberish>[],
      _totalAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getBusinessBalance(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFundersAddresses(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getQuantityOfTierBought(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTierPrice(
      _tier: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isOwnerOf(
      _tier: PromiseOrValue<BigNumberish>,
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAllowedToken(
      _allowedErc20Token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setBusinessAddress(
      _businessAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setCampaignAndDecisionPeriod(
      _campaignTimesAndDecision: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFundingTiersAndCosts(
      _fundingTiers: IFundABusiness.FundingTierCostStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMOATFee(
      _feeFraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMilestones(
      _milestonesData: IFundABusiness.MilestoneStructStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setNftPerkContracts(
      _nftTierContracts: IFundABusiness.NftTierContractStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTargetAmounts(
      _amountsToBeRaised: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTreasuryAddress(
      _treasuryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFundRaised(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
