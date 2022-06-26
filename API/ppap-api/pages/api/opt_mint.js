import Web3 from 'web3'

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const provider = new Web3(new Web3.providers.HttpProvider(process.env.KOVAN_RPC));
const contract = require('../../src/contracts/Frens.json');
const contractAddress = process.env.KOVAN_ADDRESS;
const Contract = new provider.eth.Contract(contract.abi, contractAddress, { from: PUBLIC_KEY });

const MintCard = async (address, tokenURI, res) => {
  console.log("minting");
  const nonce = await provider.eth.getTransactionCount(PUBLIC_KEY, 'latest');
  const data = await Contract.methods
    .mintNFT(address, tokenURI)
    .encodeABI();
  const tx = {
    "gas": 500000,
    "to": contractAddress,
    "nonce": nonce,
    "data": data,
    "from": address
  };
  await provider.eth.accounts.signTransaction(tx, PRIVATE_KEY, async (err, signedTx) => {
    if (err) return console.log('SIGN ERROR', err);
    console.log('SIGNING', signedTx)
    await provider.eth.sendSignedTransaction(signedTx.rawTransaction, (err, resp) => {
      if (err) return console.log('MINT ERROR', err)
      console.log('MINTING', resp)
      res.status(200).send("success minting");
    });
  });
};

const checkConnection = async (address, interactAddress, res) => {
  const poc_metadata = {
    "name": `POC of ${address}`,
    "holder": address,
    "pocWith": interactAddress,
    "timestamp": Date.now()
  }
  MintCard(address, JSON.stringify(poc_metadata), res);
}

const handler = async (req, res) => {
  console.log('REQ.BODY', req.body);
  checkConnection(req.body.address_pri, req.body.address_sec, res);
};
export default handler;
