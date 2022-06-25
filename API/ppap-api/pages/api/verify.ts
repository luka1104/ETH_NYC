import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = (req: NextApiRequest, res: NextApiResponse) => {


  console.log(req.body);
};
export default handler;
