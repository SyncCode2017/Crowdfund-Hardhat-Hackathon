import { doesNotMatch } from "assert"
import { network } from "hardhat"
import { resolve } from "path"
export function sleep(timeInMs: number) {
    console.log(`Sleeping for ${timeInMs}`)
    return new Promise((resolve) => setTimeout(resolve, timeInMs))
}
export async function moveBlocks(amount: number) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
    }
    console.log(`Moved ${amount} blocks`)
}
