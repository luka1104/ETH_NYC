import { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios'

// const storeData = async (data :any) => {
//   const config = {
//     headers: {
//       'x-api-key': '207203de-007e-4e4b-8a9c-840c5d7add24'
//     },
//   }
//   axios.post('https://api-us-west1.tatum.io/v3/ipfs', data, config)
//   .then(resp => {
//     console.log(resp);
//   })
//   .catch(e => {
//     console.log(e);
//   });
// }

const handler = (req: NextApiRequest, res: NextApiResponse) => {
//   storeData(req.body);
  // console.log(req.body);
};
export default handler;
