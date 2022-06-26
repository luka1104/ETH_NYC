import Web3 from 'web3'

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const provider = new Web3(new Web3.providers.HttpProvider(process.env.MUMBAI_RPC));
const contract = require('../../src/contracts/Frens.json');
const contractAddress = process.env.CONTRACT_ADDRESS;
const Contract = new provider.eth.Contract(contract.abi, contractAddress, { from: PUBLIC_KEY });

const handler = async (req, res) => {
  console.log('REQ.BODY', req.body);
  await Contract.methods.getTokenUriFromAddress(req.body).call((err, tokenUris) => {
    if (err) {
      console.log("An error occured", err);
      res.status(500).send("An error occured");
      return
    }
    console.log(tokenUris);
    res.status(200).send(tokenUris);
  })
};
export default handler;
