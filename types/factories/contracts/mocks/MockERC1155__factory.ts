/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  MockERC1155,
  MockERC1155Interface,
} from "../../../contracts/mocks/MockERC1155";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_businessAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "nftTier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tierMaxSupply",
            type: "uint256",
          },
        ],
        internalType: "struct MockERC1155.NftTierMaxSupply[]",
        name: "_tiersMaxSupply",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "MaxSupplyReached",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "circulatingSupplyOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "hasReachedCap",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "maxSupplyOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_salePrice",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setRoyalties",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002156380380620021568339810160408190526200003491620002e1565b60408051808201909152601481527f697066733a2f736f6d6572616e646f6d4349442f000000000000000000000000602082015262000073816200010f565b506200007f3362000121565b6200008d826109c462000173565b60005b81518110156200010657818181518110620000af57620000af620003de565b60200260200101516020015160046000848481518110620000d457620000d4620003de565b60200260200101516000015181526020019081526020016000208190555080620000fe90620003f4565b905062000090565b50505062000577565b60026200011d8282620004ab565b5050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6200017d6200020f565b620186a0811115620001d65760405162461bcd60e51b815260206004820152601a60248201527f45524332393831526f79616c746965733a20546f6f206869676800000000000060448201526064015b60405180910390fd5b604080518082019091526001600160a01b039092168083526020909201819052600680546001600160a01b031916909217909155600755565b6003546001600160a01b031633146200026b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401620001cd565b565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b0381118282101715620002a857620002a86200026d565b60405290565b604051601f8201601f191681016001600160401b0381118282101715620002d957620002d96200026d565b604052919050565b6000806040808486031215620002f657600080fd5b83516001600160a01b03811681146200030e57600080fd5b602085810151919450906001600160401b03808211156200032e57600080fd5b818701915087601f8301126200034357600080fd5b8151818111156200035857620003586200026d565b62000368848260051b01620002ae565b818152848101925060069190911b8301840190898211156200038957600080fd5b928401925b81841015620003ce5785848b031215620003a85760008081fd5b620003b262000283565b845181528585015186820152835292850192918401916200038e565b8096505050505050509250929050565b634e487b7160e01b600052603260045260246000fd5b6000600182016200041557634e487b7160e01b600052601160045260246000fd5b5060010190565b600181811c908216806200043157607f821691505b6020821081036200045257634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620004a657600081815260208120601f850160051c81016020861015620004815750805b601f850160051c820191505b81811015620004a2578281556001016200048d565b5050505b505050565b81516001600160401b03811115620004c757620004c76200026d565b620004df81620004d884546200041c565b8462000458565b602080601f831160018114620005175760008415620004fe5750858301515b600019600386901b1c1916600185901b178555620004a2565b600085815260208120601f198616915b82811015620005485788860151825594840194600190910190840162000527565b5085821015620005675787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b611bcf80620005876000396000f3fe608060405234801561001057600080fd5b506004361061011a5760003560e01c8063715018a6116100b2578063a22cb46511610081578063e985e9c511610066578063e985e9c51461029e578063f242432a146102da578063f2fde38b146102ed57600080fd5b8063a22cb4651461026b578063de177b971461027e57600080fd5b8063715018a614610222578063731133e91461022a5780638c7ea24b1461023d5780638da5cb5b1461025057600080fd5b80632a55205a116100ee5780632a55205a146101a85780632eb2c2d6146101da5780634e1273f4146101ef5780635798fc951461020f57600080fd5b8062fdd58e1461011f57806301ffc9a7146101455780630e89341c146101685780632564eed714610188575b600080fd5b61013261012d3660046113e7565b610300565b6040519081526020015b60405180910390f35b610158610153366004611427565b6103ac565b604051901515815260200161013c565b61017b61017636600461144b565b6103ea565b60405161013c91906114aa565b61013261019636600461144b565b60046020526000908152604090205481565b6101bb6101b63660046114bd565b61047e565b604080516001600160a01b03909316835260208301919091520161013c565b6101ed6101e836600461162b565b6104c9565b005b6102026101fd3660046116d5565b61056b565b60405161013c91906117d1565b61015861021d36600461144b565b6106a9565b6101ed6106d8565b6101ed6102383660046117e4565b6106ec565b6101ed61024b3660046113e7565b61076e565b6003546040516001600160a01b03909116815260200161013c565b6101ed610279366004611845565b61080f565b61013261028c36600461144b565b60056020526000908152604090205481565b6101586102ac366004611881565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b6101ed6102e83660046118b4565b61081e565b6101ed6102fb366004611919565b6108b9565b60006001600160a01b0383166103835760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b506000818152602081815260408083206001600160a01b03861684529091529020545b92915050565b60006001600160e01b031982167f2a55205a0000000000000000000000000000000000000000000000000000000014806103a657506103a682610949565b6060600280546103f990611934565b80601f016020809104026020016040519081016040528092919081815260200182805461042590611934565b80156104725780601f1061044757610100808354040283529160200191610472565b820191906000526020600020905b81548152906001019060200180831161045557829003601f168201915b50505050509050919050565b604080518082019091526006546001600160a01b0316808252600754602083018190529091600091620186a0906104b59086611984565b6104bf91906119a3565b9150509250929050565b6001600160a01b0385163314806104e557506104e585336102ac565b6105575760405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161037a565b61056485858585856109e4565b5050505050565b606081518351146105e45760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d617463680000000000000000000000000000000000000000000000606482015260840161037a565b6000835167ffffffffffffffff811115610600576106006114df565b604051908082528060200260200182016040528015610629578160200160208202803683370190505b50905060005b84518110156106a15761067485828151811061064d5761064d6119c5565b6020026020010151858381518110610667576106676119c5565b6020026020010151610300565b828281518110610686576106866119c5565b602090810291909101015261069a816119db565b905061062f565b509392505050565b6000818152600560209081526040808320546004909252822054106106d057506001919050565b506000919050565b6106e0610c57565b6106ea6000610cb1565b565b6106f4610c57565b6106fd836106a9565b15610737576040517ff9f849150000000000000000000000000000000000000000000000000000000081526004810184905260240161037a565b60008381526005602052604081208054600192906107569084906119f4565b90915550610768905084848484610d10565b50505050565b610776610c57565b620186a08111156107c95760405162461bcd60e51b815260206004820152601a60248201527f45524332393831526f79616c746965733a20546f6f2068696768000000000000604482015260640161037a565b604080518082019091526001600160a01b0390921680835260209092018190526006805473ffffffffffffffffffffffffffffffffffffffff1916909217909155600755565b61081a338383610e40565b5050565b6001600160a01b03851633148061083a575061083a85336102ac565b6108ac5760405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161037a565b6105648585858585610f34565b6108c1610c57565b6001600160a01b03811661093d5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161037a565b61094681610cb1565b50565b60006001600160e01b031982167fd9b67a260000000000000000000000000000000000000000000000000000000014806109ac57506001600160e01b031982167f0e89341c00000000000000000000000000000000000000000000000000000000145b806103a657507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316146103a6565b8151835114610a5b5760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161037a565b6001600160a01b038416610abf5760405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b606482015260840161037a565b3360005b8451811015610be9576000858281518110610ae057610ae06119c5565b602002602001015190506000858381518110610afe57610afe6119c5565b602090810291909101810151600084815280835260408082206001600160a01b038e168352909352919091205490915081811015610b915760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b606482015260840161037a565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610bce9084906119f4565b9250508190555050505080610be2906119db565b9050610ac3565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610c39929190611a07565b60405180910390a4610c4f8187878787876110df565b505050505050565b6003546001600160a01b031633146106ea5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161037a565b600380546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038416610d8c5760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161037a565b336000610d9885611284565b90506000610da585611284565b90506000868152602081815260408083206001600160a01b038b16845290915281208054879290610dd79084906119f4565b909155505060408051878152602081018790526001600160a01b03808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610e37836000898989896112cf565b50505050505050565b816001600160a01b0316836001600160a01b031603610ec75760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c660000000000000000000000000000000000000000000000606482015260840161037a565b6001600160a01b03838116600081815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b038416610f985760405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b606482015260840161037a565b336000610fa485611284565b90506000610fb185611284565b90506000868152602081815260408083206001600160a01b038c168452909152902054858110156110375760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b606482015260840161037a565b6000878152602081815260408083206001600160a01b038d8116855292528083208985039055908a168252812080548892906110749084906119f4565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46110d4848a8a8a8a8a6112cf565b505050505050505050565b6001600160a01b0384163b15610c4f5760405163bc197c8160e01b81526001600160a01b0385169063bc197c81906111239089908990889088908890600401611a35565b6020604051808303816000875af192505050801561115e575060408051601f3d908101601f1916820190925261115b91810190611a93565b60015b6112135761116a611ab0565b806308c379a0036111a3575061117e611acc565b8061118957506111a5565b8060405162461bcd60e51b815260040161037a91906114aa565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560448201527f526563656976657220696d706c656d656e746572000000000000000000000000606482015260840161037a565b6001600160e01b0319811663bc197c8160e01b14610e375760405162461bcd60e51b815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a656374656044820152676420746f6b656e7360c01b606482015260840161037a565b604080516001808252818301909252606091600091906020808301908036833701905050905082816000815181106112be576112be6119c5565b602090810291909101015292915050565b6001600160a01b0384163b15610c4f5760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e61906113139089908990889088908890600401611b56565b6020604051808303816000875af192505050801561134e575060408051601f3d908101601f1916820190925261134b91810190611a93565b60015b61135a5761116a611ab0565b6001600160e01b0319811663f23a6e6160e01b14610e375760405162461bcd60e51b815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a656374656044820152676420746f6b656e7360c01b606482015260840161037a565b80356001600160a01b03811681146113e257600080fd5b919050565b600080604083850312156113fa57600080fd5b611403836113cb565b946020939093013593505050565b6001600160e01b03198116811461094657600080fd5b60006020828403121561143957600080fd5b813561144481611411565b9392505050565b60006020828403121561145d57600080fd5b5035919050565b6000815180845260005b8181101561148a5760208185018101518683018201520161146e565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006114446020830184611464565b600080604083850312156114d057600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff8111828210171561151b5761151b6114df565b6040525050565b600067ffffffffffffffff82111561153c5761153c6114df565b5060051b60200190565b600082601f83011261155757600080fd5b8135602061156482611522565b60405161157182826114f5565b83815260059390931b850182019282810191508684111561159157600080fd5b8286015b848110156115ac5780358352918301918301611595565b509695505050505050565b600082601f8301126115c857600080fd5b813567ffffffffffffffff8111156115e2576115e26114df565b6040516115f9601f8301601f1916602001826114f5565b81815284602083860101111561160e57600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a0868803121561164357600080fd5b61164c866113cb565b945061165a602087016113cb565b9350604086013567ffffffffffffffff8082111561167757600080fd5b61168389838a01611546565b9450606088013591508082111561169957600080fd5b6116a589838a01611546565b935060808801359150808211156116bb57600080fd5b506116c8888289016115b7565b9150509295509295909350565b600080604083850312156116e857600080fd5b823567ffffffffffffffff8082111561170057600080fd5b818501915085601f83011261171457600080fd5b8135602061172182611522565b60405161172e82826114f5565b83815260059390931b850182019282810191508984111561174e57600080fd5b948201945b8386101561177357611764866113cb565b82529482019490820190611753565b9650508601359250508082111561178957600080fd5b506104bf85828601611546565b600081518084526020808501945080840160005b838110156117c6578151875295820195908201906001016117aa565b509495945050505050565b6020815260006114446020830184611796565b600080600080608085870312156117fa57600080fd5b611803856113cb565b93506020850135925060408501359150606085013567ffffffffffffffff81111561182d57600080fd5b611839878288016115b7565b91505092959194509250565b6000806040838503121561185857600080fd5b611861836113cb565b91506020830135801515811461187657600080fd5b809150509250929050565b6000806040838503121561189457600080fd5b61189d836113cb565b91506118ab602084016113cb565b90509250929050565b600080600080600060a086880312156118cc57600080fd5b6118d5866113cb565b94506118e3602087016113cb565b93506040860135925060608601359150608086013567ffffffffffffffff81111561190d57600080fd5b6116c8888289016115b7565b60006020828403121561192b57600080fd5b611444826113cb565b600181811c9082168061194857607f821691505b60208210810361196857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561199e5761199e61196e565b500290565b6000826119c057634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052603260045260246000fd5b6000600182016119ed576119ed61196e565b5060010190565b808201808211156103a6576103a661196e565b604081526000611a1a6040830185611796565b8281036020840152611a2c8185611796565b95945050505050565b60006001600160a01b03808816835280871660208401525060a06040830152611a6160a0830186611796565b8281036060840152611a738186611796565b90508281036080840152611a878185611464565b98975050505050505050565b600060208284031215611aa557600080fd5b815161144481611411565b600060033d1115611ac95760046000803e5060005160e01c5b90565b600060443d1015611ada5790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715611b0a57505050505090565b8285019150815181811115611b225750505050505090565b843d8701016020828501011115611b3c5750505050505090565b611b4b602082860101876114f5565b509095945050505050565b60006001600160a01b03808816835280871660208401525084604083015283606083015260a06080830152611b8e60a0830184611464565b97965050505050505056fea2646970667358221220b5ba85abb156018ec46af388a2da99bb7e7daff89fb2cd4ff17b291be92fa30c64736f6c63430008100033";

type MockERC1155ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC1155ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC1155__factory extends ContractFactory {
  constructor(...args: MockERC1155ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _businessAddress: PromiseOrValue<string>,
    _tiersMaxSupply: MockERC1155.NftTierMaxSupplyStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC1155> {
    return super.deploy(
      _businessAddress,
      _tiersMaxSupply,
      overrides || {}
    ) as Promise<MockERC1155>;
  }
  override getDeployTransaction(
    _businessAddress: PromiseOrValue<string>,
    _tiersMaxSupply: MockERC1155.NftTierMaxSupplyStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _businessAddress,
      _tiersMaxSupply,
      overrides || {}
    );
  }
  override attach(address: string): MockERC1155 {
    return super.attach(address) as MockERC1155;
  }
  override connect(signer: Signer): MockERC1155__factory {
    return super.connect(signer) as MockERC1155__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC1155Interface {
    return new utils.Interface(_abi) as MockERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC1155 {
    return new Contract(address, _abi, signerOrProvider) as MockERC1155;
  }
}
