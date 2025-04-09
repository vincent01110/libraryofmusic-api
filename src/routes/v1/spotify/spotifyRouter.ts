import { Router } from 'express';
import { container } from 'tsyringe';
import SpotifyController from '../../../controllers/v1/spotify/SpotifyController';
import { authMiddleware } from '../../../middlewares/AuthMiddleware';

const spotifyRouter = Router();
const spotifyController = container.resolve(SpotifyController);

spotifyRouter.use(authMiddleware);

spotifyRouter.get('/me', spotifyController.getUserInfo);
spotifyRouter.get('/me/albums', spotifyController.getUserAlbums);


export default spotifyRouter;