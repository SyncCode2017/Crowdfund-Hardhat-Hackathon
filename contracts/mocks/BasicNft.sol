// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IERC2981.sol";

error MaxSupplyReached();

contract BasicNft is ERC721, IERC2981, Ownable, ReentrancyGuard {
    string public constant TOKEN_URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 private s_tokenCounter;
    uint256 public immutable maxSupply;

    struct RoyaltyInfo {
        address recipient;
        uint256 amount;
    }

    RoyaltyInfo private _royalties;

    event NFTMinted(uint256 indexed tokenId, address to);

    //Interface for royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    constructor(address _receiver, uint256 _maxSupply) ERC721("TIER1", "TIER1") {
        setRoyalties(_receiver, 2500);
        s_tokenCounter = 1;
        maxSupply = _maxSupply;
    }

    function mintNft(address _to) external onlyOwner nonReentrant {
        if (hasReachedCap()) revert MaxSupplyReached();
        _safeMint(_to, s_tokenCounter);
        emit NFTMinted(s_tokenCounter, _to);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function hasReachedCap() public view returns (bool) {
        if (maxSupply >= s_tokenCounter) {
            return true;
        }
        return false;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, IERC165) returns (bool) {
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
