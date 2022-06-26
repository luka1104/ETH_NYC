const { ethers } = require("hardhat")

async function main() {
  const FRENS = await ethers.getContractFactory("Frens")

  const Frens = await FRENS.deploy()
  await Frens.deployed()
  console.log("Contract deployed to address:", Frens.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
