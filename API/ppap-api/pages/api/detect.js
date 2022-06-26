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

const getDetections = async (db) => {
  const conCol = collection(db, 'detections');
  const conSnap = await getDocs(conCol);
  const conList = conSnap.docs.map(doc => doc.data());
  const detections = {};
  conList.forEach(con => detections[con.address] = con.timestamp);
  return detections;
};

const addConnection = async (address, timestamp) => {
  await setDoc(doc(db, 'detections', address), {
    address: address,
    timestamp: timestamp
  });
};

const handler = async (req, res) => {
  await addConnection(req.body, Date.now());
  const detections = await getDetections(db);
  const now = Date.now();
  console.log('detections', detections); 
  console.log('REQ.BODY', req.body);
  
  let found = '';
  for (const [a, t] of Object.entries(detections)) {
    console.log(`address: ${a} time: ${t}`);
    if (t > now - 20000 && a != req.body) {
      found = a;
      break;
    }
  }

  if (found) {
    console.log('Transfering');
  } else {
    console.log('Adding');
    detections[req.body] = now;
    res.status(200).send("success adding");
  }
};
export default handler;
