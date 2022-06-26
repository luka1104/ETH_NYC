import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next';
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

const getImageUri = async (address :string) => {
  const docRef = doc(db, 'verifiedAddress', address)
  const docSnap = await getDoc(docRef);
  const imageUri = await docSnap.get('image_uri');
  return imageUri;
}

const getChain = async (address :string) => {
  const docRef = doc(db, 'verifiedAddress', address)
  const docSnap = await getDoc(docRef);
  const chainInfo = await docSnap.get('chain');
  return chainInfo;
}

const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_RPC)

const checkENS = async (address :string) => {
  var ensName = await provider.lookupAddress(address);
  console.log(ensName);
  return ensName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ensName = await checkENS(req.body.address);
  const imageUri = await getImageUri(req.body.address);
  const chain = await getChain(req.body.address);
  console.log(imageUri);
  const data = {
    'ensName': ensName,
    'imageUri': imageUri,
    'chain': chain
  }
  console.log(data);
  res.status(200).send(data);
  console.log(req.body);
};
export default handler;
