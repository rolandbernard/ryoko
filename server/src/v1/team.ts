
import express from 'express';

import { requireVerification } from './auth';

const team = express();

team.use(requireVerification);



export default team;

