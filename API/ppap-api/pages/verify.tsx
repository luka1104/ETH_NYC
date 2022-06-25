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
  

  return (
    <div>
      Verify
    </div>
  )
}

export default Verify
