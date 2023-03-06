// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IBasicNft is IERC721 {
    function mintNft(address _to) external;

    function hasReachedCap() external view returns (bool);
}
