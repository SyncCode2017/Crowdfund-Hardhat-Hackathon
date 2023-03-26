// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INftPerks {
    error MaxSupplyReached();
    error InvalidValue();

    // Emitted when NFTs are minted
    event NFTMinted(uint256 indexed tokenId, address to);
    // Emitted when the base URI is updated
    event UriUpdated(string value);

    function mintNft(address _to) external;

    function hasReachedCap() external view returns (bool);
}
