// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IERC2981.sol";
import "./interfaces/INftPerks.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NftPerks is ERC721, INftPerks, IERC2981, AccessControl, ReentrancyGuard {
    string public constant TOKEN_URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 public tokenId;
    uint256 public immutable maxSupply;

    struct RoyaltyInfo {
        address recipient;
        uint256 amount;
    }

    RoyaltyInfo private _royalties;

    event NFTMinted(uint256 indexed tokenId, address to);

    //Interface for royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    // access control roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    constructor(address _receiver, string memory _tierName, uint256 _maxSupply) ERC721(_tierName, _tierName) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);

        setRoyalties(_receiver, 2500);
        maxSupply = _maxSupply;
    }

    function mintNft(address _to) external onlyRole(MINTER_ROLE) nonReentrant {
        if (hasReachedCap()) revert MaxSupplyReached();
        _safeMint(_to, tokenId);
        emit NFTMinted(tokenId, _to);
        tokenId += 1;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function hasReachedCap() public view returns (bool) {
        if (maxSupply <= tokenId) {
            return true;
        }
        return false;
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721, IERC165) returns (bool) {
        return interfaceId == _INTERFACE_ID_ERC2981 || super.supportsInterface(interfaceId);
    }

    function setRoyalties(address recipient, uint256 value) public onlyRole(MANAGER_ROLE) {
        if (value > 100000) revert InvalidValue();

        _royalties = RoyaltyInfo(recipient, value);
    }

    function royaltyInfo(uint256, uint256 _salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        RoyaltyInfo memory royalties = _royalties;
        receiver = royalties.recipient;
        royaltyAmount = (_salePrice * royalties.amount) / 100000;
    }
}