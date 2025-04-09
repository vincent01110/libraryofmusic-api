import { autoInjectable } from 'tsyringe';
import SpotifyClient from '../../../utils/SpotifyClient';
import { BaseController } from '../BaseController';
import { getTokenFromCookie } from '../../../utils/utils';
import { Request, Response } from 'express';
import SpotifyAuthService from '../../../services/SpotifyAuthService';
import UserNotFoundError from '../../../models/errors/UserNotFoundError';

@autoInjectable()
export default class SpotifyController extends BaseController {
    private spotifyClient: SpotifyClient;
    private spotifyAuthService: SpotifyAuthService;

    constructor(spotifyClient: SpotifyClient, spotifyAuthService: SpotifyAuthService) {
        super();
        this.spotifyClient = spotifyClient;
        this.spotifyAuthService = spotifyAuthService;

        this.getUserInfo = this.getUserInfo.bind(this);
    }

    public async getUserInfo(req: Request, res: Response) {
        try {
            const email = this.jwtService.getUser(getTokenFromCookie(req) || '');
            const accessToken = await this.spotifyAuthService.getAccessToken(email);

            const userInfo = await this.spotifyClient.getUserInfo(accessToken);

            if (!userInfo) throw new UserNotFoundError('User not found in Spotify DB!');

            res.status(200).json(userInfo); 
        } catch (e) {
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: 'Error while getting user info!' });
        }
    }

    public async getUserAlbums(req: Request, res: Response) {
        try {
            const { limit, offset } = req.query;

            if (!limit || offset === undefined)
                throw new Error('Query params missing! Include limit and offset!');

            if (isNaN(Number(limit)) || isNaN(Number(offset)))
                throw new Error('Query params must be numbers!');

            const email = this.jwtService.getUser(getTokenFromCookie(req) || '');
            const accessToken = await this.spotifyAuthService.getAccessToken(email);

            const userAlbums = await this.spotifyClient.getUserAlbums(accessToken, +limit, +offset);

            res.status(200).json(userAlbums);
        } catch (e) {
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: 'Error while getting user albums!' });
        }
    }
}