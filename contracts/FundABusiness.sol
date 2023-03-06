// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./interfaces/IFundABusiness.sol";
import "./interfaces/IBasicNft.sol";

// import "hardhat/console.sol";

contract FundABusiness is IFundABusiness, AccessControl, ReentrancyGuard, Pausable {
    // defensive as not required after pragma ^0.8
    using SafeMath for uint256;
    using ERC165Checker for address;
    using SafeERC20 for IERC20;

    address private treasuryAddress;
    address public businessAddress;
    address[] private fundersAddresses;
    uint256 public campaignStartTime;
    uint256 public campaignEndTime;
    uint256 public minTargetAmount;
    uint256 public targetAmount;
    uint256 public fundRaised;
    uint256 public cumFundReleased;
    bool verdict = true;
    bool areNftTokensSet = false;
    uint256 private constant nftAmount = 1;

    IERC20 public allowedErc20Token;

    mapping(address => uint256) public funderTier;
    mapping(uint256 => uint256) public tierCost;
    mapping(address => bool) public hasClaimedNft;
    mapping(uint256 => IBasicNft) public nftTierContract;

    FundingTierCost[] fundingTiersCosts;
    MilestoneCheckpoint[] milestoneSchedule;
    NftTierContract[] nftTiersContracts;

    // access control roles
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    constructor(address _allowedErc20Token, address _businessAddress, address _treasuryAddress, uint256[] memory _amountsToBeRaised, uint256[] memory _campaignPeriod, FundingTierCost[] memory _fundingTiers, MilestoneCheckpoint[] memory _milestoneSchedule) {
        if (_allowedErc20Token == address(0) && _businessAddress == address(0) && _treasuryAddress == address(0)) {
            revert ZeroAddress();
        }
        // initialise the contract
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        setAllowedToken(_allowedErc20Token);
        setTargetAmounts(_amountsToBeRaised);
        setFundingTiersAndCosts(_fundingTiers);
        setTreasuryAddress(_treasuryAddress);
        setBusinessAddress(_businessAddress);
        setCampaignPeriod(_campaignPeriod);
        setMilestonesSchedule(_milestoneSchedule);
    }

    //////////////////////////////////////////////////
    //////////////// Modifiers //////////////////////
    /////////////////////////////////////////////////

    modifier noZeroAddress(address newAddress) {
        if (newAddress == address(0)) revert ZeroAddress();
        _;
    }

    modifier onlyFunders(address _funder) {
        if (funderTier[_funder] <= 0) revert NotAFunder();
        _;
    }

    // modifier to check if nft token address is set
    modifier NftTokensAreSet() {
        if (!areNftTokensSet) revert NftTokensNotSet();
        _;
    }

    //////////////////////////////////////////////////
    //////////////// Setters Functions //////////////
    /////////////////////////////////////////////////

    function setAllowedToken(address _allowedErc20Token) public onlyRole(MANAGER_ROLE) noZeroAddress(_allowedErc20Token) {
        allowedErc20Token = IERC20(_allowedErc20Token);
    }

    function setNftContracts(NftTierContract[] memory _nftTiersContracts) public onlyRole(MANAGER_ROLE) {
        for (uint256 i = 0; i < _nftTiersContracts.length; ++i) {
            if (_nftTiersContracts[i].nftContract == address(0)) revert ZeroAddress();
            nftTierContract[_nftTiersContracts[i].fundingTier] = IBasicNft(_nftTiersContracts[i].nftContract);
        }
        areNftTokensSet = true;
    }

    function setTreasuryAddress(address _treasuryAddress) public onlyRole(MANAGER_ROLE) noZeroAddress(_treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    function setBusinessAddress(address _businessAddress) public onlyRole(MANAGER_ROLE) noZeroAddress(_businessAddress) {
        businessAddress = _businessAddress;
    }

    function setFundingTiersAndCosts(FundingTierCost[] memory _fundingTiers) public onlyRole(MANAGER_ROLE) {
        if (block.timestamp > campaignStartTime) revert TooLateToChange();
        for (uint256 i = 0; i < _fundingTiers.length; ++i) {
            tierCost[_fundingTiers[i].fundingTier] = _fundingTiers[i].tierCost;
        }
    }

    function setTargetAmounts(uint256[] memory _amountsToBeRaised) public onlyRole(MANAGER_ROLE) {
        if (_amountsToBeRaised.length != 2) revert InvalidValues();
        minTargetAmount = _amountsToBeRaised[0];
        targetAmount = _amountsToBeRaised[1];
    }

    function setCampaignPeriod(uint256[] memory _campaignTimes) public onlyRole(MANAGER_ROLE) {
        if (_campaignTimes.length != 2) revert InvalidValues();
        if (block.timestamp < campaignStartTime) {
            campaignStartTime = _campaignTimes[0];
            campaignEndTime = _campaignTimes[1];
        } else if (_isCampaignOpen()) {
            campaignEndTime = _campaignTimes[1];
        } else {
            revert CampaignEnded();
        }
    }

    function setMilestonesSchedule(MilestoneCheckpoint[] memory _milestoneSchedule) public onlyRole(MANAGER_ROLE) {
        for (uint256 i = 0; i < _milestoneSchedule.length; ++i) {
            if (_milestoneSchedule[i].cumFractionToBeReleased > 100000) revert FractionTooHigh();
            milestoneSchedule.push(_milestoneSchedule[i]);
        }
    }

    //////////////////////////////////////////////////
    //////////////// Main Functions /////////////////
    /////////////////////////////////////////////////

    /// @notice contribute fund for the open campaign.
    /// @dev only accepts ERC-20 deposit when campaign is open
    /// @param _tier funding category.
    function contribute(uint256 _tier) external nonReentrant whenNotPaused {
        if (!_isCampaignOpen()) revert CampaignNotOpen();
        uint256 _fundingAmount = tierCost[_tier];
        // check whether the _tier is allowed
        if (_fundingAmount <= 0) revert InvalidTier();
        // check whether the funder has not contributed before
        if (funderTier[msg.sender] > 0) revert NoMultipleFunding();
        // check how much the funder has approved for this transaction
        if (allowedErc20Token.allowance(msg.sender, address(this)) < _fundingAmount) revert NeedMoreTokens();
        // receive deposit and update state
        allowedErc20Token.safeTransferFrom(msg.sender, address(this), _fundingAmount);
        funderTier[msg.sender] = _tier;
        fundersAddresses.push(msg.sender);
        fundRaised += _fundingAmount;
        emit ContributionReceived(msg.sender, _tier);
    }

    function claimRefundFor(address _funder) public onlyFunders(_funder) nonReentrant whenNotPaused {
        if (isCampaignSuccessful()) revert NoRefund();
        uint256 _tier = funderTier[_funder];
        uint256 _amount = tierCost[_tier];
        delete funderTier[_funder];
        sendToken(_funder, _amount);
        emit ContributionRefunded(_funder, _tier);
    }

    function claimRefund() external {
        claimRefundFor(msg.sender);
    }

    function claimNft() external {
        claimNftFor(msg.sender);
    }

    function claimNftFor(address _funder) public onlyFunders(_funder) NftTokensAreSet nonReentrant whenNotPaused {
        if (!isCampaignSuccessful()) revert CampaignUnsuccessful();
        if (hasClaimedNft[_funder]) revert FunderHasClaimedNft();
        uint256 _tier = funderTier[_funder];
        hasClaimedNft[_funder] = true;
        nftTierContract[_tier].mintNft(_funder);
    }

    function withdrawFundRaised() external nonReentrant whenNotPaused {
        if (msg.sender != businessAddress) revert NotTheOwner();
        if (!isCampaignSuccessful()) revert CampaignUnsuccessful();
        uint256 _amountToRelease = (_fractionOfFundToRelease().mul(fundRaised).div(10 ** 5)).sub(cumFundReleased);
        if (_amountToRelease <= 0) revert NoFundDue();
        cumFundReleased += _amountToRelease;
        sendToken(msg.sender, _amountToRelease);
        emit FundReleased(msg.sender, _amountToRelease, block.timestamp);
    }

    function contributeOnBehalfOf(address[] memory _funders, uint256[] memory _tiers, uint256 _totalAmount) external onlyRole(MANAGER_ROLE) nonReentrant whenNotPaused {
        if (_funders.length != _tiers.length) revert InvalidValues();
        // check how much the funder has approved for this transaction
        if (allowedErc20Token.allowance(msg.sender, address(this)) < _totalAmount) revert NeedMoreTokens();
        // receive deposit
        allowedErc20Token.safeTransferFrom(msg.sender, address(this), _totalAmount);
        fundRaised += _totalAmount;
        // update state
        for (uint256 i = 0; i < _funders.length; ++i) {
            if (_funders[i] == address(0)) revert ZeroAddress();
            // check whether the _tier is allowed
            uint256 _fundingAmount = tierCost[_tiers[i]];
            if (_fundingAmount <= 0) revert InvalidTier();
            // check whether the funder has not contributed before
            if (funderTier[_funders[i]] > 0) revert NoMultipleFunding();
            funderTier[_funders[i]] = _tiers[i];
            fundersAddresses.push(_funders[i]);
            emit ContributionReceived(_funders[i], _tiers[i]);
        }
        emit FiatContributionReceived(msg.sender, _totalAmount);
    }

    function isCampaignSuccessful() public view returns (bool) {
        if (block.timestamp <= campaignEndTime) revert Undecided();
        if (!_isCampaignOpen() && fundRaised >= minTargetAmount && verdict == true) {
            return true;
        }
        return false;
    }

    function cancelFundingRound() external onlyRole(MANAGER_ROLE) {
        campaignEndTime = block.timestamp;
        verdict = false;
    }

    function _isCampaignOpen() internal view returns (bool) {
        if (block.timestamp > campaignStartTime && block.timestamp <= campaignEndTime) {
            return true;
        }
        return false;
    }

    function _fractionOfFundToRelease() internal view returns (uint256) {
        for (uint256 i = (milestoneSchedule.length - 1); i >= 0; --i) {
            if (i == milestoneSchedule.length - 1 && block.timestamp >= milestoneSchedule[i].milestonePeriod) {
                return milestoneSchedule[i].cumFractionToBeReleased;
            } else if (block.timestamp >= milestoneSchedule[i].milestonePeriod && block.timestamp < milestoneSchedule[i + 1].milestonePeriod) {
                return milestoneSchedule[i].cumFractionToBeReleased;
            }
        }
        return 0;
    }

    ///@dev contract cannot receive ether
    receive() external payable {
        revert();
    }

    /// @notice Transfer token from the contract to the recipient
    /// @param _to The recipient address
    /// @param _amount The amount of tokens to transfer
    function sendToken(address _to, uint256 _amount) internal {
        address payable _recipient = payable(_to);
        // check the contract balance
        if (allowedErc20Token.balanceOf(address(this)) < _amount) {
            revert InsufficientBalance();
        }
        // send token to the recipient
        allowedErc20Token.safeTransfer(_recipient, _amount);
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

    function getFundersAddresses() external view onlyRole(MANAGER_ROLE) returns (address[] memory) {
        address[] memory _fundersAddresses = fundersAddresses;
        return _fundersAddresses;
    }
}
