import { Router } from 'express';
import shelfRouter from './shelf/shelfRoute';
import authRouter from './auth/authRoute';
import spotifyRouter from './spotify/spotifyRouter';
import carouselRouter from './carousel/carouselRouter';

const v1Router = Router();

v1Router.use('/shelf', shelfRouter);

v1Router.use('/auth', authRouter);

v1Router.use('/spotify', spotifyRouter);

v1Router.use('/carousel', carouselRouter);

export default v1Router;
