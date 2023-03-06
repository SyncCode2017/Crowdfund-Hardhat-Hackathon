// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IMockERC1155 {
    function mint(address receiver, uint256 id, uint256 amount, bytes memory data) external;

    function hasReachedCap() external view returns (bool);
}
