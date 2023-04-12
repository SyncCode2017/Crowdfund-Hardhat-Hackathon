// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INftPerks is IERC721 {
    error MaxSupplyReached();
    error NonexistentToken();
    error InvalidTokenUri();
    error InvalidValue();

    struct RoyaltyInfo {
        // address to receive the royalties
        address recipient;
        // amount tokens to be paid as royalty
        uint256 amount;
    }

    // Emitted when NFTs are minted
    event NFTMinted(uint256 indexed tokenId, address to);
    // Emitted when the base URI is updated
    event UriUpdated(string value);

    /// @notice Mint NFT perks to the campaigner funders.
    /// @dev only the MINTER_ROLE can mint the NFT.
    /// @param _to the contributor address
    function mintNft(address _to) external;

    /// @notice token uri must be set before calling this function
    /// @param _tokenId minted token id
    /// @return tokenUri token uri
    function tokenURI(uint256 _tokenId) external view returns (string memory);

    /// @dev returns true if the maxSupply of the NFT tokens has been reacheds
    function hasReachedCap() external view returns (bool);

    /// @dev returns true for all the interfaces supported by this contract.
    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    /// @notice Sets royalty address and fee
    /// @dev only MANAGER_ROLE can set the royalty fee
    /// @param _recipient funding category
    /// @param _royaltyFee numerator of %ge of the sales price to be paid as royalty
    /// e.g 5% => 5 * (10**5) / 100 = 5000
    function setRoyalties(address _recipient, uint256 _royaltyFee) external;

    /// @dev The secondary marketplace have to call this function to get the royalty data
    /// @param _salePrice sales price of the NFT in the secondary market
    /// @return receiver address for receiving royalties
    /// @return royaltyAmount amount of tokens to be paid to the receiver address as royalty.
    function royaltyInfo(uint256, uint256 _salePrice) external view returns (address receiver, uint256 royaltyAmount);
}
