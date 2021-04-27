
import express from 'express';

import auth, { tokenVerification } from './auth';
import user from './user';
import team from './team';
import project from './project';
import task from './task';
import comment from './comment';

const v1 = express();

v1.use(tokenVerification);
v1.use('/auth', auth);
v1.use('/user', user);
v1.use('/team', team);
v1.use('/project', project);
v1.use('/task', task);
v1.use('/comment', comment);

export default v1;

