import { Router } from 'express';
import shelfRouter from './shelf/shelfRoute';

const v1Router = Router(); 

v1Router.use('/shelf', shelfRouter);

export default v1Router;