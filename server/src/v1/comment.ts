
import express from 'express';

import { requireVerification } from './auth';

const comment = express();

comment.use(requireVerification);



export default comment;

