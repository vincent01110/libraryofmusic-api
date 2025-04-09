import { Router } from 'express';
import { container } from 'tsyringe';
import SpotifyController from '../../../controllers/v1/spotify/SpotifyController';
import { authMiddleware } from '../../../middlewares/AuthMiddleware';

const spotifyRouter = Router();
const spotifyController = container.resolve(SpotifyController);

spotifyRouter.use(authMiddleware);

spotifyRouter.get('/me', spotifyController.getUserInfo);
spotifyRouter.get('/me/albums', spotifyController.getUserAlbums);
spotifyRouter.get('/album/query', spotifyController.queryAllAlbums);
spotifyRouter.get('/album/random', spotifyController.getRandomAlbums);
spotifyRouter.get('/album/:id', spotifyController.getAlbum);

export default spotifyRouter;