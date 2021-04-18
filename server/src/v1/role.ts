
import express from 'express';

import { requireVerification } from './auth';

const role = express();

role.use(requireVerification);



export default role;

