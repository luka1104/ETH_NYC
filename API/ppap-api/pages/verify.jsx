import React from 'react'
import { useRouter } from "next/router";

const Verify = () => {
  const jwt = require('jsonwebtoken');
  const jwksClient = require('jwks-rsa');
  const client = jwksClient({ jwksUri: 'https://developer.worldcoin.org/api/v1/jwks'});
  const { query } = useRouter();

  const getKey = (header, callback) => {
    client.getSigningKey(header.kid, function(err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    })
  }

  jwt.verify(query.verification_jwt, getKey, function(err, decoded) {
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

export default Verify
