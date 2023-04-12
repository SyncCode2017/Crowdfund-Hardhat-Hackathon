// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./interfaces/IFundABusiness.sol";
import "./interfaces/INftPerks.sol";

/**@title MOAT Crowd-funding Contract
 * @custom:security-contact hello@moat.com
 * @notice This contract is for crowd-funding a business by interested parties and
 * to release funds to the business in a transparent but monitored way. Rewards, in form
 * of NFTs are distributed to funders after the funding round has been declared successful.
 * @dev This implements ERC-721 NFT as the rewards (NFT perks) to be minted to the funders.
 */
contract FundABusiness is IFundABusiness, AccessControl, ReentrancyGuard, Pausable {
    // defensive as not required after pragma ^0.8
    using SafeMath for uint256;
    using ERC165Checker for address;
    using SafeERC20 for IERC20;

    // address of the MOAT treasury wallet
    address private treasuryAddress;
    // address of the busineess raising fund
    address public businessAddress;
    // addresses of all the contributors
    address[] private fundersAddresses;
    // unix time at which the funding campaign opens
    uint256 public campaignStartTime;
    // unix time at which the funding campaign closes
    uint256 public campaignEndTime;
    // unix time at which decision period ends
    uint256 public campaignDecisionTime;
    // minimum amount of tokens that the business wishes to raise
    uint256 public minTargetAmount;
    // optimum amount of tokens that the business wishes to raise
    uint256 public targetAmount;
    // actual amount of tokens raised by the business
    uint256 public fundRaised;
    // amount of tokens raised after MOAT fee has been deducted
    uint256 public fundRaisedMinusFee;
    // numerator of the %ge MOAT fee e.g 5% fee => 5 * (10**5) / 100 = 5000
    uint256 public moatFeeNumerator;
    // amount of tokens deducted as MOAT fees
    uint256 private moatFee;
    // cumulative amount of tokens released to business based on milestones completed so far
    uint256 public cumFundReleased;
    // returns true if the NFT perks contracts have been set
    bool areNftTokensSet = false;
    // returns true if the MOAT fee has been deducted
    bool isFeeTaken = false;
    // ERC20 token approved for campaign funding e.g USDC, USDT
    IERC20 public allowedErc20Token;

    // returns number of tier perks purchased by a funder
    mapping(address => mapping(uint256 => uint256)) public tierBalanceOf;
    // returns the price of a tier
    mapping(uint256 => uint256) public tierCost;
    // returns the corresponding  NFT contract of a tier perk
    mapping(uint256 => INftPerks) public nftContractOf;
    // returns true if a given funder has claimed his NFT perk
    mapping(address => mapping(uint256 => bool)) public hasClaimedNft;
    // returns true if a given address has contributed for the curent campaign
    mapping(address => bool) public isAFunder;
    // returns the numerator of the fraction of fund to be released after a milestone has been approved
    mapping(uint256 => uint256) public fractionOfMilestone;
    // returns true if a given milestone has been approved
    mapping(uint256 => bool) public isMilestoneApproved;
    // returns the amount of tokens available for the business to claim
    mapping(address => uint256) public businessBalance;

    // array of tiers available and thier prices
    FundingTierCost[] fundingTiersCosts;
    // array of tiers available and their corresponding NFT contracts
    NftTierContract[] nftTierContracts;
    // decision made whether the campaign was sucessful
    CampaignState public verdict;
    // reason for closing the campaign abruptly
    EndCampaign private reasonForEnding;

    // access control roles
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    constructor(address _allowedErc20Token, address _businessAddress, address _treasuryAddress, uint256 _feeFraction, uint256[] memory _amountsToBeRaised, uint256[] memory _campaignAndDecisionPeriod, FundingTierCost[] memory _fundingTiers, MilestoneStruct[] memory _milestonesData) {
        // initialise the contract
        if (_campaignAndDecisionPeriod.length != 3) revert InvalidValues();
        campaignStartTime = _campaignAndDecisionPeriod[0];
        campaignEndTime = _campaignAndDecisionPeriod[1];
        campaignDecisionTime = _campaignAndDecisionPeriod[1].add(_campaignAndDecisionPeriod[2]);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        setAllowedToken(_allowedErc20Token);
        setTargetAmounts(_amountsToBeRaised);
        setFundingTiersAndCosts(_fundingTiers);
        setTreasuryAddress(_treasuryAddress);
        setBusinessAddress(_businessAddress);
        setMilestones(_milestonesData);
        setMOATFee(_feeFraction);
        verdict = CampaignState.UNDECIDED;
    }

    //////////////////////////////////////////////////
    //////////////// Modifiers //////////////////////
    /////////////////////////////////////////////////

    // checks whether the given is zero address
    modifier noZeroAddress(address newAddress) {
        if (newAddress == address(0)) revert ZeroAddress();
        _;
    }
    // checks whether the given address has contributed for the current campaign
    modifier onlyFunders(address _funder) {
        if (!isAFunder[_funder]) revert NotAFunder();
        _;
    }
    // checks if nft token address is set
    modifier nftTokensAreSet() {
        if (!areNftTokensSet) revert NftTokensNotSet();
        _;
    }

    //////////////////////////////////////////////////
    //////////////// Setters Functions //////////////
    /////////////////////////////////////////////////

    ///@dev sets the allowed ERC20 tokens for the campaign
    function setAllowedToken(address _allowedErc20Token) public onlyRole(MANAGER_ROLE) noZeroAddress(_allowedErc20Token) {
        allowedErc20Token = IERC20(_allowedErc20Token);
    }

    ///@dev sets the NFT perks contracts
    function setNftPerkContracts(NftTierContract[] memory _nftTierContracts) external onlyRole(MANAGER_ROLE) {
        for (uint256 i = 0; i < _nftTierContracts.length; ++i) {
            if (_nftTierContracts[i].nftTokenAddress == address(0)) revert ZeroAddress();
            nftContractOf[_nftTierContracts[i].fundingTier] = INftPerks(_nftTierContracts[i].nftTokenAddress);
        }
        areNftTokensSet = true;
    }

    ///@dev sets the MOAT treasury address
    function setTreasuryAddress(address _treasuryAddress) public onlyRole(MANAGER_ROLE) noZeroAddress(_treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    /// @dev Set the wallet address of the business raising fund through this contract
    function setBusinessAddress(address _businessAddress) public onlyRole(MANAGER_ROLE) noZeroAddress(_businessAddress) {
        businessAddress = _businessAddress;
    }

    ///@dev sets the available tiers and their corresponding prices
    function setFundingTiersAndCosts(FundingTierCost[] memory _fundingTiers) public onlyRole(MANAGER_ROLE) {
        if (block.timestamp > campaignStartTime) revert TooLateToChange();
        for (uint256 i = 0; i < _fundingTiers.length; ++i) {
            tierCost[_fundingTiers[i].fundingTier] = _fundingTiers[i].tierCost;
        }
    }

    /// @param _amountsToBeRaised array of length 2.
    function setTargetAmounts(uint256[] memory _amountsToBeRaised) public onlyRole(MANAGER_ROLE) {
        if (block.timestamp > campaignDecisionTime) revert TooLateToChange();
        if (_amountsToBeRaised.length != 2) revert InvalidValues();
        minTargetAmount = _amountsToBeRaised[0];
        targetAmount = _amountsToBeRaised[1];
    }

    /// @param _campaignTimesAndDecision array of length 3.
    function setCampaignAndDecisionPeriod(uint256[] memory _campaignTimesAndDecision) public onlyRole(MANAGER_ROLE) {
        if (_campaignTimesAndDecision.length != 3) revert InvalidValues();
        if (block.timestamp < campaignStartTime) {
            campaignStartTime = _campaignTimesAndDecision[0];
            campaignEndTime = _campaignTimesAndDecision[1];
            campaignDecisionTime = _campaignTimesAndDecision[1].add(_campaignTimesAndDecision[2]);
        } else if (_isCampaignOpen()) {
            campaignEndTime = _campaignTimesAndDecision[1];
            campaignDecisionTime = _campaignTimesAndDecision[1].add(_campaignTimesAndDecision[2]);
        } else if (block.timestamp >= campaignEndTime && block.timestamp < campaignDecisionTime) {
            campaignDecisionTime = campaignEndTime.add(_campaignTimesAndDecision[2]);
        } else {
            revert CampaignEnded();
        }
    }

    ///@dev sets the milestones
    function setMilestones(MilestoneStruct[] memory _milestonesData) public onlyRole(MANAGER_ROLE) {
        for (uint256 i = 0; i < _milestonesData.length; ++i) {
            if (_milestonesData[i].fractionToBeReleased > 100000) revert FractionTooHigh();
            fractionOfMilestone[_milestonesData[i].milestoneNumber] = _milestonesData[i].fractionToBeReleased;
        }
    }

    /// @param _feeFraction e.g 5% => 5 * (10**5) / 100 = 5000
    function setMOATFee(uint256 _feeFraction) public onlyRole(MANAGER_ROLE) {
        if (_feeFraction > 100000) revert InvalidValues();
        if (block.timestamp > campaignStartTime) revert TooLateToChange();
        moatFeeNumerator = _feeFraction;
    }

    //////////////////////////////////////////////////
    //////////////// Main Functions /////////////////
    /////////////////////////////////////////////////

    /// @notice Contribute fund on behalf of another address for the open campaign.
    /// @dev only accepts ERC-20 deposit when campaign is open
    /// @param _funder the contributor address
    /// @param _tier funding category
    /// @param _quantity number of tiers
    function contributeOnBehalfOf(address _funder, uint256 _tier, uint256 _quantity) public nonReentrant whenNotPaused noZeroAddress(_funder) {
        if (_isCampaignOpen() != true) revert CampaignNotOpen();
        uint256 _fundingAmount = tierCost[_tier].mul(_quantity);
        // check whether the _tier is allowed
        if (_fundingAmount <= 0) revert InvalidTierAndQuantity();
        _receiveToken(msg.sender, _fundingAmount);
        fundRaised += _fundingAmount;
        _updateFunderBalance(_funder, _tier, _quantity);
    }

    /// @notice Contribute fund from the connected wallet for the open campaign
    /// @dev only accepts ERC-20 deposit when campaign is open
    /// @param _tier funding category
    /// @param _quantity number of tiers
    function contribute(uint256 _tier, uint256 _quantity) external {
        contributeOnBehalfOf(msg.sender, _tier, _quantity);
    }

    /// @notice The funders can claim refund only when the campaign failed
    /// @dev Claim a refund on behalf of a funder
    /// @param _funder the funder address
    /// @param _tier funding category
    function claimRefundFor(address _funder, uint256 _tier) public onlyFunders(_funder) nonReentrant whenNotPaused {
        verdict = _campaignVerdict();
        // check if campaign failed
        if (verdict == CampaignState.SUCCESS) revert NoRefund();
        uint256 _quantity = tierBalanceOf[_funder][_tier];
        // get the amount to refund to the funder
        uint256 _amount = tierCost[_tier].mul(_quantity);
        // set funder's balance to zero
        tierBalanceOf[_funder][_tier] = 0;
        _sendToken(_funder, _amount);
        emit ContributionRefunded(_funder, _tier);
    }

    /// @notice The funders can claim refund only when the campaign failed
    /// @dev Claim a refund for the connected wallet
    /// @param _tier funding category
    function claimRefund(uint256 _tier) external {
        claimRefundFor(msg.sender, _tier);
    }

    /// @notice The funders can claim NFT perks when the campaign is successful
    /// @dev NFT with tokenId = _tier is transfer to the connected wallet
    /// @param _tier funding category
    function claimNft(uint256 _tier) external {
        claimNftFor(msg.sender, _tier);
    }

    /// @notice The funders can claim NFT perks when the campaign is successful
    /// @dev Claim NFT for another _funder. NFT with tokenId = _tier is transfer to the _funder
    /// @param _funder the funder address
    /// @param _tier funding category
    function claimNftFor(address _funder, uint256 _tier) public onlyFunders(_funder) nftTokensAreSet nonReentrant whenNotPaused {
        verdict = _campaignVerdict();
        // check whether the campaign was successful
        if (verdict != CampaignState.SUCCESS) revert CampaignUnsuccessful();
        // check whether the funder has unclaimed NFT
        if (hasClaimedNft[_funder][_tier]) revert FunderHasClaimedNft();
        // get the number of unclaimed NFT tokens
        uint256 _quantity = tierBalanceOf[_funder][_tier];
        hasClaimedNft[_funder][_tier] = true;
        tierBalanceOf[_funder][_tier] = 0;
        // transfer the unclaimed NFT tokens to the funder
        for (uint256 i = 0; i < _quantity; ++i) {
            nftContractOf[_tier].mintNft(_funder);
        }
    }

    /// @notice Funds are released to the authorised business wallet based on the
    /// milestone schedule.
    /// @dev Only the authorised business wallet can withdraw
    function withdrawFundRaised() external nonReentrant whenNotPaused {
        // check whether it is the business wallet that is calling this function
        if (msg.sender != businessAddress) revert NotTheOwner();
        verdict = _campaignVerdict();
        // check whether the campaign was successful
        if (block.timestamp > campaignDecisionTime && verdict != CampaignState.SUCCESS) revert CampaignUnsuccessful();
        // get the amount to release from the milestone schedule
        uint256 _amount = businessBalance[businessAddress];
        if (_amount <= 0) revert NoFundDue();
        businessBalance[businessAddress] = 0;
        _sendToken(businessAddress, _amount);
        emit FundReleased(businessAddress, _amount, block.timestamp);
    }

    /// @notice Manager role can contribute fund on behalf of other addresses before decision time passed.
    /// @dev only accepts ERC-20 deposit before campaign decision time passed
    /// @param _funders array of funder addresses
    /// @param _tiers array of funding category
    /// @param _quantities array of number of tiers purchased by each funder
    /// All the arrays must be the same length
    function fiatContributeOnBehalfOf(address[] memory _funders, uint256[] memory _tiers, uint256[] memory _quantities, uint256 _totalAmount) external onlyRole(MANAGER_ROLE) nonReentrant whenNotPaused {
        verdict = _campaignVerdict();
        // check whether decision time has passed and decision has been made
        if (block.timestamp < campaignStartTime || block.timestamp > campaignDecisionTime || verdict != CampaignState.UNDECIDED) revert NotReceivingFunds();
        // check the arrays have the same length
        if (_funders.length != _tiers.length || _funders.length != _quantities.length) revert InvalidValues();
        _receiveToken(msg.sender, _totalAmount);
        fundRaised += _totalAmount;
        // update state
        for (uint256 i = 0; i < _funders.length; ++i) {
            if (_funders[i] == address(0)) revert ZeroAddress();
            uint256 _fundingAmount = tierCost[_tiers[i]].mul(_quantities[i]);
            // check whether the _tier is allowed
            if (_fundingAmount <= 0) revert InvalidTierAndQuantity();
            _updateFunderBalance(_funders[i], _tiers[i], _quantities[i]);
        }
        emit FiatContributionReceived(msg.sender, _totalAmount);
    }

    /// @notice Manager role can close the funding round before the decision time passed
    /// @dev reason for closing the campaign is required
    /// @param _reasonForEnding enum only accepts TARGETMET or FAILURE
    function closeFundingRound(EndCampaign _reasonForEnding) external onlyRole(MANAGER_ROLE) {
        verdict = _campaignVerdict();
        // check whether decision has been made
        if (block.timestamp > campaignDecisionTime && verdict != CampaignState.UNDECIDED) revert DecisionMade();
        // update state
        campaignEndTime = block.timestamp;
        campaignDecisionTime = block.timestamp;
        if (_reasonForEnding == EndCampaign.TARGETMET) {
            verdict = CampaignState.SUCCESS;
            _deductFeeAndSend();
        } else if (_reasonForEnding == EndCampaign.FAILURE) {
            verdict = CampaignState.FAILURE;
        } else {
            revert InvalidValues();
        }
    }

    /// @notice Manager role can approve the milestones at any time
    /// @dev milestone can be approved in any order
    /// @param _milestoneNumber the milestone to be approved
    function approveMilestoneAndReleaseFund(uint256 _milestoneNumber) external onlyRole(MANAGER_ROLE) whenNotPaused {
        verdict = _campaignVerdict();
        // check whether the campaign was successful
        if (block.timestamp < campaignDecisionTime) revert Undecided();
        if (verdict != CampaignState.SUCCESS) revert CampaignUnsuccessful();
        if (isMilestoneApproved[_milestoneNumber] == true) revert AlreadyApproved();
        isMilestoneApproved[_milestoneNumber] = true;
        _releaseFundToBusiness(_milestoneNumber);
    }

    /// @dev Proves that a caller owns a particular NFT token by emitting IsTheTrueOwner event
    /// It emits NotTheTrueOwner event if the caller is not the owner
    /// @param _tier funding or perks category
    /// @param _tokenId id of the nft token
    function isOwnerOf(uint256 _tier, uint256 _tokenId) external {
        address _owner = nftContractOf[_tier].ownerOf(_tokenId);
        if (msg.sender == _owner) {
            emit IsTheTrueOwner(_owner, _tier, _tokenId);
        } else {
            emit NotTheTrueOwner(msg.sender, _tier, _tokenId);
        }
    }

    /// @dev Decides the campaign state at any point in time
    /// @return verdict enum which can only be SUCCESS, FAILURE or UNDECIDED
    /// based on the outcome of the campaign
    function _campaignVerdict() internal returns (CampaignState) {
        if (block.timestamp > campaignDecisionTime && fundRaised >= minTargetAmount && verdict != CampaignState.FAILURE) {
            _deductFeeAndSend();
            return CampaignState.SUCCESS;
        } else if (block.timestamp > campaignDecisionTime && fundRaised < minTargetAmount && verdict != CampaignState.SUCCESS) {
            return CampaignState.FAILURE;
        }
        return verdict;
    }

    /// @dev To check whether the funding round is open. Returns a boolean
    function _isCampaignOpen() internal returns (bool) {
        verdict = _campaignVerdict();
        if ((block.timestamp > campaignStartTime) && (block.timestamp <= campaignEndTime) && (verdict == CampaignState.UNDECIDED)) {
            return true;
        }
        return false;
    }

    /// @dev release fund to business
    /// @param _milestoneNumber the milestone to be approved
    function _releaseFundToBusiness(uint256 _milestoneNumber) internal {
        uint256 _milestoneFraction = fractionOfMilestone[_milestoneNumber];
        // get the amount to release from the milestone schedule
        uint256 _amountToRelease = (_milestoneFraction.mul(fundRaisedMinusFee).div(10 ** 5));
        if (cumFundReleased.add(_amountToRelease) > fundRaisedMinusFee) revert ReleasingMoreThanFundRaised();
        cumFundReleased += _amountToRelease;
        businessBalance[businessAddress] += _amountToRelease;
    }

    /// @dev contract cannot receive ether
    receive() external payable {
        revert();
    }

    /// @notice Transfer token from a sender to the contract
    /// @param _from The recipient address
    /// @param _amount The amount of tokens to transfer from the sender
    function _receiveToken(address _from, uint256 _amount) internal {
        // check how much the sender has approved for this transaction
        if (allowedErc20Token.allowance(_from, address(this)) < _amount) revert NeedMoreTokens();
        // receive deposit and update state
        allowedErc20Token.safeTransferFrom(_from, address(this), _amount);
    }

    /// @notice Transfer token from the contract to the recipient
    /// @param _to The recipient address
    /// @param _amount The amount of tokens to transfer
    function _sendToken(address _to, uint256 _amount) internal {
        address payable _recipient = payable(_to);
        // send token to the recipient
        allowedErc20Token.safeTransfer(_recipient, _amount);
    }

    function _updateFunderBalance(address _funder, uint256 _tier, uint256 _quantity) internal {
        tierBalanceOf[_funder][_tier] += _quantity;
        emit ContributionReceived(_funder, _tier);
        // check whether is an existing funder
        if (!isAFunder[_funder]) {
            fundersAddresses.push(_funder);
            isAFunder[_funder] = true;
        }
    }

    /// @dev deducts fee and send to the treasury account
    function _deductFeeAndSend() internal {
        // check whether fee has been deducted and sent before
        if (isFeeTaken == false) {
            moatFee = fundRaised.mul(moatFeeNumerator).div(100000);
            fundRaisedMinusFee = fundRaised.sub(moatFee);
            isFeeTaken = true;
            _sendToken(treasuryAddress, moatFee);
        }
    }

    /// @dev Pauses the contract
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @dev Unpauses the contract
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    //////////////////////////////////////////////////
    //////////////// Getter /////////////////////////
    /////////////////////////////////////////////////

    /// @dev returns the array of all funder addresses
    function getFundersAddresses() external view onlyRole(MANAGER_ROLE) returns (address[] memory) {
        address[] memory _fundersAddresses = fundersAddresses;
        return _fundersAddresses;
    }
}
