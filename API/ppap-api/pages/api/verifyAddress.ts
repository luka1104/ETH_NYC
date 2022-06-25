import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore/lite";
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.alchemyapi.io/v2/yKp4_FehNB_rOc9ZMCDfnZtQ7rCrZ8WP")

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

const checkIsVerified = async (address :string) => {
  const docRef = doc(db, 'verifiedAddress', address)
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()) {
    console.log("data exists");
    return true;
  } else {
    return false;
  }
};

const checkENS = async (address :string) => {
  var ensName = await provider.lookupAddress(address);
  console.log(ensName);
  return ensName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ensName = await checkENS(req.body);
  const resp = await checkIsVerified(req.body);
  if(resp) {
    console.log(resp, ensName);
    res.status(200).send(ensName);
  } else {
    console.log(resp, ensName);
    res.status(201).send(ensName);
  }
  console.log(req.body);
};
export default handler;
