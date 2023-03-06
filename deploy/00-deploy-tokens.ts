import { ContractTransaction } from "ethers"
import { ethers } from "hardhat"
import { Address, DeployResult } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { BASE_URI_OBJECTS, BASE_URI_RESOURCES, BURNER_ROLE, developmentChains, MINTER_ROLE } from "../helpers/constants"
import { getBlockConfirmations } from "../helpers/helper-functions"
import { Object as ObjectType, Resource as ResourceType } from "../types"


module.exports = async (hre:HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const baseUriObjects: string = process.env.BASE_URI_OBJECTS || BASE_URI_OBJECTS
    const baseUriResources: string = process.env.BASE_URI_RESOURCES || BASE_URI_RESOURCES
    const waitBlockConfirmations: number = getBlockConfirmations(developmentChains, network)

    const deployArgsResources: [string] = [baseUriResources]
    const resourceDeployment: DeployResult = await deploy("Resource", {
        from              : deployer,
        args              : deployArgsResources,
        waitConfirmations : waitBlockConfirmations,
    })

    console.log(`\n###\n Resource deployed to address ${resourceDeployment.address}`)

    const deployArgsObjects: [string] = [baseUriObjects]
    const objectDeployment: DeployResult = await deploy("Object", {
        from              : deployer,
        args              : deployArgsObjects,
        waitConfirmations : waitBlockConfirmations,
    })

    console.log(`\n###\n Object deployed to address ${objectDeployment.address}`)

    const object: ObjectType = await ethers.getContract("Object")
    const resource: ResourceType = await ethers.getContract("Resource")

    const minter: Address = process.env.MINTER || deployer
    const burner: Address = process.env.BURNER || deployer

    const tx1: ContractTransaction = await object.grantRole(MINTER_ROLE, minter)
    await tx1.wait()
    const tx2: ContractTransaction = await object.grantRole(BURNER_ROLE, burner)
    await tx2.wait()
    const tx3: ContractTransaction = await resource.grantRole(MINTER_ROLE, minter)
    await tx3.wait()
    const tx4: ContractTransaction = await resource.grantRole(BURNER_ROLE, burner)
    await tx4.wait()

    console.log("Roles for minter and burner were granted")
}

module.exports.tags = ["all", "tokens"]
