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
  conList.forEach(con => detections[con.address] = {'time': con.timestamp, 'chain':con.chain});
  return detections;
};

const addConnection = async (address, timestamp, chain) => {
  await setDoc(doc(db, 'detections', address), {
    address: address,
    timestamp: timestamp,
    chain: chain
  });
};

const mintToken = async (req, found) => {
  if(req.body.chain === 'polygon') {
    const pol_data = {
      'address_pri': req.body.address,
      'address_sec': found
    }
    const pol_res = await fetch(`http://localhost:3000/api/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pol_data),
    });
    return pol_res;
  } else if(req.body.chain === 'optimism') {
    const opt_data = {
      'address_pri': req.body.address,
      'address_sec': found
    }
    const opt_res = await fetch(`http://localhost:3000/api/opt_mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(opt_data),
    });
    return opt_res;
  }
}

const handler = async (req, res) => {
  await addConnection(req.body.address, Date.now(), req.body.chain);
  const detections = await getDetections(db);
  const now = Date.now();
  console.log('detections', detections); 
  console.log('REQ.BODY', req.body);
  
  let found = '';
  let foundChain = '';
  for (const [a, t] of Object.entries(detections)) {
    console.log(`address: ${a} time: ${t.time} chain: ${t.chain}`);
    if (t.time > now - 20000 && a != req.body.address) {
      found = a;
      foundChain = t.chain;
      break;
    }
  }

  if (found) {
    console.log('minting');
    mintToken(req, found);
    if(foundChain === 'polygon') {
      const pol_data_sec = {
        'address_pri': found,
        'address_sec': req.body.address
      }
      fetch(`http://localhost:3000/api/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pol_data_sec),
      });
    } else if(foundChain === 'optimism') {
      const opt_data_sec = {
        'address_pri': found,
        'address_sec': req.body.address
      }
      fetch(`http://localhost:3000/api/opt_mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opt_data_sec),
      });
    }
    console.log(found);
    console.log(req.body);
  } else {
    console.log('Adding');
    detections[req.body.address] = now;
    res.status(200).send("success adding");
  }
};
export default handler;
