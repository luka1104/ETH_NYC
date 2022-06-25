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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await checkIsVerified(req.body);
  if(resp) {
    console.log(resp);
    res.status(200).send("address is verified");
  } else {
    console.log(resp);
    res.status(201).send("address is not verified");
  }
  console.log(req.body);
};
export default handler;
