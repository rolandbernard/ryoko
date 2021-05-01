
import express from 'express';

import { requireVerification } from './auth';

const work = express();

work.use(requireVerification);



export default work;

