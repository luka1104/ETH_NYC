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
      'image_uri': 'https://api-us-west1.tatum.io/v3/ipfs/bafybeictvixj4ayyryj7jwvzsmtodiwafh4ghhkfudl3bt2cugafkjngg4',
      'chain': 'optimism'
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
    const data = {
      'address': "0x50B80aa3877fC852f3194a0331177FDDcF0891bf",
      'chain': 'polygon'
    }
    const data2 = {
      'address': "0x872449c44937f6ac266cbbcdcb189b25acebb9e9",
      'chain': 'optimism'
    }
    fetch(`/api/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  const handleMint = () => {
    const data = {
      'address': "0x50B80aa3877fC852f3194a0331177FDDcF0891bf",
      'chain': 'polygon'
    }
    fetch(`/api/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  const handleUri = () => {
    const data = {
      'address': "0x50B80aa3877fC852f3194a0331177FDDcF0891bf"
    }
    fetch(`/api/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  const handleInfo = () => {
    const data = {
      'address': "0x50B80aa3877fC852f3194a0331177FDDcF0891bf"
    }
    fetch(`/api/getInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

      <button
        onClick={handleInfo}
      >
        get data
      </button>
    </div>
  )
}

export default test
