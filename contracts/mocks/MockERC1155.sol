//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IERC2981.sol";

error MaxSupplyReached(uint256 _tier);

contract MockERC1155 is ERC1155, IERC2981, Ownable {
    uint256 public constant TIER1 = 1;
    uint256 public constant TIER2 = 2;
    uint256 public constant TIER3 = 3;
    mapping(uint256 => uint256) public maxSupplyOf;
    mapping(uint256 => uint256) public circulatingSupplyOf;

    struct RoyaltyInfo {
        address recipient;
        uint256 amount;
    }

    struct NftTierMaxSupply {
        // Tier of NFT available
        uint256 nftTier;
        // corresponding maxSupply of the Tier
        uint256 tierMaxSupply;
    }

    RoyaltyInfo private _royalties;
    NftTierMaxSupply[] nftTiersMaxSupply;

    //Interface for royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    constructor(address _businessAddress, NftTierMaxSupply[] memory _tiersMaxSupply) ERC1155("ipfs:/somerandomCID/") {
        setRoyalties(_businessAddress, 2500);

        for (uint256 i = 0; i < _tiersMaxSupply.length; ++i) {
            maxSupplyOf[_tiersMaxSupply[i].nftTier] = _tiersMaxSupply[i].tierMaxSupply;
        }
    }

    function mint(address receiver, uint256 _tier, uint256 amount, bytes memory data) external onlyOwner {
        if (hasReachedCap(_tier)) revert MaxSupplyReached(_tier);
        circulatingSupplyOf[_tier] += 1;
        _mint(receiver, _tier, amount, data);
    }

    function hasReachedCap(uint256 _tier) public view returns (bool) {
        if (maxSupplyOf[_tier] >= circulatingSupplyOf[_tier]) {
            return true;
        }
        return false;
    }

    //interface for royalties
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, IERC165) returns (bool) {
        return interfaceId == _INTERFACE_ID_ERC2981 || super.supportsInterface(interfaceId);
    }

    function setRoyalties(address recipient, uint256 value) public onlyOwner {
        require(value <= 100000, "ERC2981Royalties: Too high");

        _royalties = RoyaltyInfo(recipient, value);
    }

    function royaltyInfo(uint256, uint256 _salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        RoyaltyInfo memory royalties = _royalties;
        receiver = royalties.recipient;
        royaltyAmount = (_salePrice * royalties.amount) / 100000;
    }
}
