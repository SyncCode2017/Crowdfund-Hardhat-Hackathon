// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./IERC2981.sol";

interface INftCommon is IERC1155, IERC2981 {
    //IERC1155 functions for common interface

    ///@notice checks total balance of token in any given account
    /**
     * @param account the address to be checked
     * @param id the token id to be checked
     */
    function balanceOf(address account, uint256 id) external view override(IERC1155) returns (uint256);

    ///@notice Transfers tokens from owner address to recipient address
    /**
     * @param from origin address
     * @param to recipient address
     * @param tokenId token Id to be sent
     * @param amount total amount of tokens to send
     * @param data optional additional calldata
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes memory data) external override(IERC1155);

    //IERC721 functions for common interface

    ///@notice checks if user is the owner of the token id
    /**
     * @param tokenId token to be checked
     */
    function ownerOf(uint256 tokenId) external returns (address);

    ///@notice Transfers tokens from owner address to recipient address
    /**
     * @param from origin address
     * @param to recipient address
     * @param tokenId token Id to be sent
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}
