import React from 'react'
import { useRouter } from "next/router";
import jwt from 'jsonwebtoken';
// import jwksClient from 'jwks-rsa';
// console.log(jwksClient);

// const client = jwksClient({ jwksUri: 'https://developer.worldcoin.org/api/v1/jwks'});

const Verify = () => {
  // const { query } = useRouter();
  // const token = query.verification_jwt || "";

  // // const getKey = (header:any, callback:any) => {
  // //   client.getSigningKey(header.kid, function(err:any, key:any) {
  // //     const signingKey = key.publicKey || key.rsaPublicKey;
  // //     callback(null, signingKey);
  // //   })
  // // }

  // // const options = {}

  // jwt.verify(token, null, null, function(err:any, decoded:any) {
  //   console.log(decoded);
  //   console.log("err",err);
    
  //   // if(decoded.verified) {
  //   //   console.log("success");
  //   // }
  // });
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
  

  return (
    <div>
      Verify
      <button
        onClick={handleClick}
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
    </div>
  )
}

export default Verify
