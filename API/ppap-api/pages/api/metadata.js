import Web3 from 'web3'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDPnRC0VToZsRcoXuDG7xq9alr1fXhi_g8",
  authDomain: "meetn-9cc66.firebaseapp.com",
  projectId: "meetn-9cc66",
  storageBucket: "meetn-9cc66.appspot.com",
  messagingSenderId: "774863347933",
  appId: "1:774863347933:web:3808cdbcf47ab0a785bb34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const contract = require('../../src/contracts/Frens.json');

const getChain = async (address) => {
  const docRef = doc(db, 'verifiedAddress', address)
  const docSnap = await getDoc(docRef);
  const chainInfo = await docSnap.get('chain');
  return chainInfo;
}

const handler = async (req, res) => {
  console.log('REQ.BODY', req.body);
  const chain = await getChain(req.body.address);
  let contractAddress = '';
  let RPC = '';
  if(chain === 'polygon') {
    RPC = process.env.MUMBAI_RPC;
    contractAddress = process.env.CONTRACT_ADDRESS;
  } else if(chain === 'optimism') {
    RPC = process.env.KOVAN_RPC;
    contractAddress = process.env.KOVAN_ADDRESS;
  }
  const provider = new Web3(new Web3.providers.HttpProvider(RPC));
  const Contract = new provider.eth.Contract(contract.abi, contractAddress, { from: PUBLIC_KEY });
  await Contract.methods.getTokenUriFromAddress(req.body.address).call((err, tokenUris) => {
    if (err) {
      console.log("An error occured", err);
      res.status(500).send("An error occured");
      return
    }
    tokenUris = tokenUris.map(uri => JSON.parse(uri));
    console.log(tokenUris);
    res.status(200).send(tokenUris);
  })
};
export default handler;
