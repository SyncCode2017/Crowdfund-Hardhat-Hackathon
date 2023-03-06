import { task } from "hardhat/config"
import updateBlock from "../utils/update-block"

task("updateBlockNumber",
    "updates to a more recent block number for use in pinning to blocks when testing on a fork of mainnet").setAction(async () => {
    await updateBlock()
})
