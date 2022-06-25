import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc } from "firebase/firestore/lite";

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

const addImageUri = async (address:string, image_uri :string) => {
  await setDoc(doc(db, 'verifiedAddress', address), {
    address: address,
    image_uri: image_uri
  });
};


const handler = (req: NextApiRequest, res: NextApiResponse) => {
  addImageUri(req.body.address, req.body.image_uri);
  console.log(req.body);
};
export default handler;
