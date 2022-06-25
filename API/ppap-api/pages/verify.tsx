import React from 'react'
import { useRouter } from "next/router";

const verify = () => {
  const jwt = require('jsonwebtoken');
  const jwksClient = require('jwks-rsa');
  const client = jwksClient({ jwksUri: 'https://developer.worldcoin.org/api/v1/jwks'});
  const { query } = useRouter();

  const getKey = (header:any, callback:any) => {
    client.getSigningKey(header.kid, function(err:any, key:any) {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    })
  }

  jwt.verify(query.verification_jwt, getKey, function(err:any, decoded:any) {
    if(decoded.verified) {
      console.log("success");
    }
  });

  return (
    <div>
      Verify
    </div>
  )
}

export default verify
