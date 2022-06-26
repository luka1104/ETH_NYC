require("dotenv").config();

module.exports = {
  env: {
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    API_URL: process.env.API_URL,
    MUMBAI_RPC: process.env.MUMBAI_RPC,
    KOVAN_RPC: process.env.KOVAN_RPC,
    WORLD_ID_URI: process.env.WORLD_ID_URI,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    KOVAN_ADDRESS: process.env.KOVAN_ADDRESS
  },
}
