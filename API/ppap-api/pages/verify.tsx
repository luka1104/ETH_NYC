import React from 'react'
import { useRouter } from "next/router";
import * as jose from 'jose';

const Verify = () => {
  const { query } = useRouter();
  const token = query.verification_jwt || "";

  const verify = async () => {
    const jsonKeys = await (await fetch('https://developer.worldcoin.org/api/v1/jwks')).json()
    const publicKey = await jose.importJWK(jsonKeys.keys[0], "PS256")
  // @ts-ignore
    const {payload} = await jose.jwtVerify(token, publicKey, {issuer: 'https://developer.worldcoin.org'});
    console.log(payload.verified);
    console.log(payload.signal);
    if(payload.verified === true) {
      fetch(`/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload.signal),
      });
    }
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

  const handleMint = () => {
    fetch(`/api/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("0x50B80aa3877fC852f3194a0331177FDDcF0891bf"),
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
      <button
        onClick={handleMint}
      >
        mint
      </button>
    </div>
  )
}

export default Verify
