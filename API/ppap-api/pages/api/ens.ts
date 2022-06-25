import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next';

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL)

const checkENS = async (address :string) => {
  var ensName = await provider.lookupAddress(address);
  console.log(ensName);
  return ensName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ensName = await checkENS(req.body);
  if(ensName) {
    console.log(ensName);
    res.status(200).send(ensName);
  } else {
    console.log(ensName);
    res.status(201).send(null);
  }
  console.log(req.body);
};
export default handler;
