/**
 * @type import(‘hardhat/config’).HardhatUserConfig
 */
 require("dotenv").config();
 require("@nomiclabs/hardhat-ethers");
 const { API_URL, KOVAN_RPC, PRIVATE_KEY } = process.env;
 module.exports = {
    solidity: "0.8.4",
    defaultNetwork: "mumbai",
    networks: {
      hardhat: {},
      mumbai: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
      },
      kovan:{
        url: KOVAN_RPC,
        accounts: [`0x${PRIVATE_KEY}`],
      },
    },
 };
