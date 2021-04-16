
import express from 'express';

import auth, { tokenVerification } from './auth';
import user from './user';

const v1 = express();

v1.use(tokenVerification);
v1.use('/auth', auth);
v1.use('/user', user);

export default v1;

