import React from 'react'

const test = () => {
 
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
    fetch(`/api/opt_mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("0x50B80aa3877fC852f3194a0331177FDDcF0891bf"),
    });
  }

  const handleUri = () => {
    fetch(`/api/opt_metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("0x50B80aa3877fC852f3194a0331177FDDcF0891bf"),
    });
  }
  

  return (
    <div>
      Test
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
      <button
        onClick={handleUri}
      >
        get metadata
      </button>
    </div>
  )
}

export default test
