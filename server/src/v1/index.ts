
import express from 'express';

import auth, { tokenVerification } from './auth';

const v1 = express();

v1.use(tokenVerification);
v1.use('/auth', auth);

export default v1;

