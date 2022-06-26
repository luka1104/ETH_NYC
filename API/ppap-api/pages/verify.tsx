import React, { useState } from 'react'
import { useRouter } from "next/router";
import {
  Center,
  Text
} from '@chakra-ui/react'
import * as jose from 'jose';

const Verify = () => {
  const [verified, setVerified] = useState(false);
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
      setVerified(payload.verified);
      fetch(`/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload.signal),
      });
    }
  }
  if(query.success) {
    verify();
    console.log('verifing');
  }
  return (
    <>
      {verified ? (
        <Center>
          <Text
           justifyContent="center"
          >
            Verified!! You Can Use The App Now.
          </Text>
        </Center>
      ) : (
        <>
        </>
      )}
    </>
  )
}

export default Verify
