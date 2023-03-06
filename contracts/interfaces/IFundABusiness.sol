// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IFundABusiness {
    error ZeroAddress();
    error TransactionFailed();
    error InsufficientBalance();
    error TooLateToChange();
    error InvalidTier();
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
    error NoMultipleFunding();
    error CampaignEnded();
    error FractionTooHigh();

    struct FundingTierCost {
        // Tier of NFT available
        uint256 fundingTier;
        // corresponding cost of the Tier
        uint256 tierCost;
    }

    struct NftTierContract {
        // Tier of NFT available
        uint256 fundingTier;
        // corresponding NFT contract address
        address nftContract;
    }

    struct MilestoneCheckpoint {
        uint256 milestonePeriod;
        uint256 cumFractionToBeReleased;
    }

    // Emitted when a valid listed item is sold at the requested price
    event ContributionReceived(address funder, uint256 tier);

    event FiatContributionReceived(address funder, uint256 amount);

    event ContributionRefunded(address funder, uint256 tier);

    event FundReleased(address business, uint256 amount, uint256 time);

    event NFTRewardClaimed(address funder, uint256 tier);
}
