// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IERC2981.sol";
import "./interfaces/INftPerks.sol";

/**@title MOAT NFT Perks Contract
 * @custom:security-contact hello@moat.com
 * @notice This NFT contract is for rewarding funders who contributed in the campaign.
 * @dev This implements ERC-721 NFT as the rewards (NFT perks) to be minted to the funders.
 */
contract NftPerks is ERC721, INftPerks, IERC2981, AccessControl, ReentrancyGuard {
    // token uri pointing to the metadata
    string private tokenUri;
    // unique token id for every minted NFT token
    uint256 public tokenId;
    // maximum number of NFT tokens that can be minted from this contract
    uint256 public immutable maxSupply;
    // returns true if the token Uri has been set
    bool public isTokenUriSet;

    RoyaltyInfo private _royalties;

    //Interface for royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    // access control roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    constructor(string memory _tierName, string memory _tierSymbol, uint256 _maxSupply, address _receiver, string memory tokenURI_, uint256 _royaltyFee) ERC721(_tierName, _tierSymbol) {
        // initialise the contract
        if (bytes(tokenURI_).length <= 0) revert InvalidTokenUri();
        tokenUri = tokenURI_;
        maxSupply = _maxSupply;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        setRoyalties(_receiver, _royaltyFee);
    }

    /// @notice Mint NFT perks to the campaigner funders.
    /// @dev only the MINTER_ROLE can mint the NFT.
    /// @param _to the contributor address
    function mintNft(address _to) external onlyRole(MINTER_ROLE) nonReentrant {
        if (hasReachedCap()) revert MaxSupplyReached();
        _safeMint(_to, tokenId);
        emit NFTMinted(tokenId, _to);
        tokenId += 1;
    }

    /// @notice token uri must be set before calling this function
    /// @param _tokenId minted token id
    /// @return tokenUri token uri
    function tokenURI(uint256 _tokenId) public view override(ERC721, INftPerks) returns (string memory) {
        if (!_exists(_tokenId)) revert NonexistentToken();
        return tokenUri;
    }

    /// @dev returns true if the maxSupply of the NFT tokens has been reached
    function hasReachedCap() public view returns (bool) {
        if (maxSupply <= tokenId) {
            return true;
        }
        return false;
    }

    /// @dev returns true for all the interfaces supported by this contract.
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721, IERC165, INftPerks) returns (bool) {
        return interfaceId == _INTERFACE_ID_ERC2981 || super.supportsInterface(interfaceId);
    }

    /// @notice Sets royalty address and fee
    /// @dev only MANAGER_ROLE can set the royalty fee
    /// @param _recipient funding category
    /// @param _royaltyFee numerator of %ge of the sales price to be paid as royalty
    /// e.g 5% => 5 * (10**5) / 100 = 5000
    function setRoyalties(address _recipient, uint256 _royaltyFee) public onlyRole(MANAGER_ROLE) {
        if (_royaltyFee > (10 ** 5)) revert InvalidValue();
        _royalties = RoyaltyInfo(_recipient, _royaltyFee);
    }

    /// @dev The secondary marketplace have to call this function to get the royalty data
    /// @param _salePrice sales price of the NFT in the secondary market
    /// @return receiver address for receiving royalties
    /// @return royaltyAmount amount of tokens to be paid to the receiver address as royalty.
    function royaltyInfo(uint256, uint256 _salePrice) external view override(IERC2981, INftPerks) returns (address receiver, uint256 royaltyAmount) {
        RoyaltyInfo memory royalties = _royalties;
        receiver = royalties.recipient;
        royaltyAmount = (_salePrice * royalties.amount) / (10 ** 5);
    }
}
