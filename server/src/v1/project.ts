
import express from 'express';

import { requireVerification } from './auth';

const project = express();

project.use(requireVerification);



export default project;
