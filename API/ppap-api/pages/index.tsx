import type { NextPage } from 'next'
import React, { useState } from 'react'
import Head from 'next/head'
import {
  Link,
  Input,
  Button
} from '@chakra-ui/react';
import styles from '../styles/Home.module.css'
import { useRouter } from "next/router";


const Home: NextPage = () => {
  var ethereum_address = require('ethereum-address');
  const { query } = useRouter();
  const [address, setAddress] = useState<string>('')
  const handleInputChange = (e:any) => {
    const val = e.target.value;
    setAddress(val)
    console.log(val);
  }
  const handleClick = () => {
    fetch(`/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Input
          type='text'
          fontFamily='Dm Sans'
          placeholder='Wallet Address'
          value={address}
          onChange={(e) => {handleInputChange(e)}}
          w="50%"
        />
        {ethereum_address.isAddress(address) ? (
          <div id="world-id-container">
            <Link
              fontFamily='Dm Sans'
              href={`https://developer.worldcoin.org/hosted/wid_68e8cff610043f0b03888aa7fcf1907e?signal=${address}`}
            >
              Verify with World ID
            </Link>
          </div>
        ) : (
          <></>
        )}
        {query.success === "true" ? (
          <Button
            onClick={handleClick}
          >
            Get Verification
          </Button>
        ) : (
          <Button
            disabled
          >
            Get Verification
          </Button>
        )}
      </main>
    </div>
  )
}

export default Home
