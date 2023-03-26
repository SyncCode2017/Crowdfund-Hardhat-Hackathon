// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IFundABusiness {
    error ZeroAddress();
    error TransactionFailed();
    error InsufficientBalance();
    error TooLateToChange();
    error InvalidTierAndQuantity();
    error NeedMoreTokens();
    error CampaignNotOpen();
    error InvalidValues();
    error NotAFunder();
    error Undecided();
    error NoRefund();
    error CampaignUnsuccessful();
    error NotTheOwner();
    error NoFundDue();
    error NftTokensNotSet();
    error FunderHasClaimedNft();
    error NotReceivingFunds();
    error CampaignEnded();
    error FractionTooHigh();
    error DecisionMade();
    error AlreadyApproved();
    error ReleasingMoreThanFundRaised();

    struct FundingTierCost {
        // Tier of NFT available
        uint256 fundingTier;
        // corresponding cost of the Tier
        uint256 tierCost;
    }

    struct NftTierContract {
        // Tier of NFT available
        uint256 fundingTier;
        // corresponding NFT address
        address nftTokenAddress;
    }

    struct MilestoneStruct {
        uint256 milestoneNumber;
         // fraction of fund raised to be released * 100000
        uint256 fractionToBeReleased;
    }

    enum CampaignState {
        SUCCESS,
        FAILURE,
        UNDECIDED
    }

    enum EndCampaign {
        TARGETMET,
        FAILURE
    }

    // Emitted when a valid listed item is sold at the requested price
    event ContributionReceived(address funder, uint256 tier);

    event FiatContributionReceived(address funder, uint256 amount);

    event ContributionRefunded(address funder, uint256 tier);

    event FundReleased(address business, uint256 amount, uint256 time);

    event NFTRewardClaimed(address funder, uint256 tier);

    function setAllowedToken(address _allowedErc20Token) external;

    function setNftPerkContracts(NftTierContract[] memory _nftTierContracts) external;

    function setTreasuryAddress(address _treasuryAddress) external;

    /// @dev Set the wallet address of the business raising fund through this contract
    function setBusinessAddress(address _businessAddress) external;

    function setFundingTiersAndCosts(FundingTierCost[] memory _fundingTiers) external;

    /// @param _amountsToBeRaised array of length 2.
    function setTargetAmounts(uint256[] memory _amountsToBeRaised) external;

    /// @param _campaignTimesAndDecision array of length 3.
    function setCampaignAndDecisionPeriod(uint256[] memory _campaignTimesAndDecision) external;

    function setMilestones(MilestoneStruct[] memory _milestonesData) external;

    /// @param _feeFraction e.g 5% => 5 * (10**5) / 100 = 5000
    function setCrowdditFee(uint256 _feeFraction) external;

    //////////////////////////////////////////////////
    //////////////// Main Functions /////////////////
    /////////////////////////////////////////////////

    /// @notice Contribute fund on behalf of another address for the open campaign.
    /// @dev only accepts ERC-20 deposit when campaign is open
    /// @param _funder the contributor address
    /// @param _tier funding category
    /// @param _quantity number of tiers
    function contributeOnBehalfOf(address _funder, uint256 _tier, uint256 _quantity) external;

    /// @notice Contribute fund from the connected wallet for the open campaign
    /// @dev only accepts ERC-20 deposit when campaign is open
    /// @param _tier funding category
    /// @param _quantity number of tiers
    function contribute(uint256 _tier, uint256 _quantity) external;

    /// @notice The funders can claim refund only when the campaign failed
    /// @dev Claim a refund on behalf of a funder
    /// @param _funder the funder address
    /// @param _tier funding category
    function claimRefundFor(address _funder, uint256 _tier) external;

    /// @notice The funders can claim refund only when the campaign failed
    /// @dev Claim a refund for the connected wallet
    /// @param _tier funding category
    function claimRefund(uint256 _tier) external;

    /// @notice The funders can claim NFT perks when the campaign is successful
    /// @dev NFT with tokenId = _tier is transfer to the connected wallet
    /// @param _tier funding category
    function claimNft(uint256 _tier) external;

    /// @notice The funders can claim NFT perks when the campaign is successful
    /// @dev Claim NFT for another _funder. NFT with tokenId = _tier is transfer to the _funder
    /// @param _funder the funder address
    /// @param _tier funding category
    function claimNftFor(address _funder, uint256 _tier) external;

    /// @notice Funds are released to the authorised business wallet based on the
    /// milestone schedule.
    /// @dev Only the authorised business wallet can withdraw
    function withdrawFundRaised() external;

    /// @notice Manager role can contribute fund on behalf of other addresses before decision time passed.
    /// @dev only accepts ERC-20 deposit before campaign decision time passed
    /// @param _funders array of funder addresses
    /// @param _tiers array of funding category
    /// @param _quantities array of number of tiers purchased by each funder
    /// All the arrays must be the same length
    function fiatContributeOnBehalfOf(address[] memory _funders, uint256[] memory _tiers, uint256[] memory _quantities, uint256 _totalAmount) external;
    
     /// @notice Manager role can close the funding round before the decision time passed
    /// @dev reason for closing the campaign is required
    /// @param _reasonForEnding enum only accepts TARGETMET or FAILURE
    function closeFundingRound(EndCampaign _reasonForEnding) external;

    /// @notice Manager role can approve the milestones at any time
    /// @dev milestone can be approved in any order
    /// @param _milestoneNumber the milestone to be approved
    function approveMilestoneAndReleaseFund(uint256 _milestoneNumber) external;

    /// @dev Proves that a caller owns a particular NFT token
    /// @param _tier funding or perks category
    /// @param _tokenId id of the nft token
    /// @return boolean
    function isOwnerOf(uint256 _tier, uint256 _tokenId) external view returns (bool);

    /// @dev returns the array of all funder addresses
    function getFundersAddresses() external view returns (address[] memory);
}
