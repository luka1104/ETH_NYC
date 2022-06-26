import React from 'react'
import { useRouter } from "next/router";
import jwt from 'jsonwebtoken';
// const jwksClient = require('jwks-rsa');
// console.log(jwksClient);
const njwk = require('node-jwk');



//const client = jwksClient({ jwksUri: 'https://developer.worldcoin.org/api/v1/jwks'});

const Verify = () => {
  const { query } = useRouter();
  const token = query.verification_jwt || "";

  // const getKey = (header:any, callback:any) => {
  //   client.getSigningKey(header.kid, function(err:any, key:any) {
  //     const signingKey = key.publicKey || key.rsaPublicKey;
  //     callback(null, signingKey);
  //   })
  // }
  const verify = async () => {
    const jsonKey = await (await fetch('https://developer.worldcoin.org/api/v1/jwks')).json()
   const myKey = njwk.JWK.fromObject(jsonKey.keys[0]);
   console.log(myKey)

  const options: jwt.VerifyOptions = {algorithms: ['PS256']}

  jwt.verify(token as string, myKey._key.toPublicKeyPEM(), options, function(err:any, decoded) {
    console.log(decoded);
    console.log("err",err);
    
    if((decoded as jwt.JwtPayload)?.verified) {
      console.log("success");
    }
  });
  }
 
  const handleClick = () => {
    fetch(`/api/verifyAddress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("0x872449c44937f6ac266cbbcdcb189b25acebb9e9"),
    });
  }

  const handleENS = () => {
    fetch(`/api/ens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("0x872449c44937f6ac266cbbcdcb189b25acebb9e9"),
    });
  }
  const handleImage = () => {
    const data = {
      'address': '0x50B80aa3877fC852f3194a0331177FDDcF0891bf',
      'image_uri': 'https://api-us-west1.tatum.io/v3/ipfs/bafybeictvixj4ayyryj7jwvzsmtodiwafh4ghhkfudl3bt2cugafkjngg4'
    }
    fetch(`/api/storeimage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  const handleDetect = () => {
    fetch(`/api/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("0x872449c44937f6ac266cbbcdcb189b25acebb9e9"),
    });
  }
  

  return (
    <div>
      Verify
      <button
        onClick={verify}
      >
        Test
      </button>
      <button
        onClick={handleENS}
      >
        ens
      </button>
      <button
        onClick={handleImage}
      >
        image
      </button>
      <button
        onClick={handleDetect}
      >
        detect
      </button>
    </div>
  )
}

export default Verify
