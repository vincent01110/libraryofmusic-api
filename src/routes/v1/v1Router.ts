import { Router } from 'express';
import shelfRouter from './shelf/shelfRoute';
import authRouter from './auth/authRoute';

const v1Router = Router(); 

v1Router.use('/shelf', shelfRouter);

v1Router.use('/auth', authRouter);

export default v1Router;