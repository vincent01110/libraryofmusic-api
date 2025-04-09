import { autoInjectable } from 'tsyringe';
import SpotifyClient from '../../../utils/SpotifyClient';
import { BaseController } from '../BaseController';
import { getTokenFromCookie } from '../../../utils/utils';
import { Request, Response } from 'express';
import SpotifyAuthService from '../../../services/SpotifyAuthService';
import UserNotFoundError from '../../../models/errors/UserNotFoundError';
import QueryParamError from '../../../models/errors/QueryParamError';
import SpotifyAPIError from '../../../models/errors/SpotifyAPIError';
import ParamError from '../../../models/errors/ParamError';

@autoInjectable()
export default class SpotifyController extends BaseController {
    private spotifyClient: SpotifyClient;
    private spotifyAuthService: SpotifyAuthService;

    constructor(spotifyClient: SpotifyClient, spotifyAuthService: SpotifyAuthService) {
        super();
        this.spotifyClient = spotifyClient;
        this.spotifyAuthService = spotifyAuthService;

        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserAlbums = this.getUserAlbums.bind(this);
        this.getAlbum = this.getAlbum.bind(this);
    }

    public async getUserInfo(req: Request, res: Response) {
        try {
            const email = this.jwtService.getUser(getTokenFromCookie(req) || '');
            const accessToken = await this.spotifyAuthService.getAccessToken(email);

            const userInfo = await this.spotifyClient.getUserInfo(accessToken);

            if (!userInfo) throw new UserNotFoundError('User not found in Spotify DB!');

            res.status(200).json(userInfo); 
        } catch (e) {
            if (e instanceof SpotifyAPIError) {
                res.status(e.getCode()).json({ code: e.getCode(), message: e.message});
                return;
            }
            if (e instanceof UserNotFoundError) {
                res.status(404).json({ code: 404, message: e.message });
                return;
            }
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: 'Error while fetching user info!' });
        }
    }

    public async getUserAlbums(req: Request, res: Response) {
        try {
            const { limit, offset } = req.query;

            if (!limit || offset === undefined)
                throw new QueryParamError('Query params missing! Include limit and offset!');

            if (isNaN(Number(limit)) || isNaN(Number(offset)))
                throw new QueryParamError('Query params must be numbers!');

            const email = this.jwtService.getUser(getTokenFromCookie(req) || '');
            const accessToken = await this.spotifyAuthService.getAccessToken(email);

            const userAlbums = await this.spotifyClient.getUserAlbums(accessToken, +limit, +offset);

            res.status(200).json(userAlbums);
        } catch (e) {
            if (e instanceof QueryParamError) {
                res.status(400).json({ code: 400, message: (e as QueryParamError).message });
                return;
            }
            if (e instanceof SpotifyAPIError) {
                res.status(e.getCode()).json({ code: e.getCode(), message: e.message });
                return;
            }
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: (e as Error).message });
        }
    }

    public async getAlbum(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id)
                throw new ParamError('Id parameter is missing!');

            const email = this.jwtService.getUser(getTokenFromCookie(req) || '');
            const accessToken = await this.spotifyAuthService.getAccessToken(email);

            const album = await this.spotifyClient.getAlbum(accessToken, id);

            res.status(200).json(album);
        } catch (e) {
            if (e instanceof ParamError) {
                res.status(400).json({ code: 400, message: e.message });
                return;
            }
            if (e instanceof SpotifyAPIError) {
                res.status(e.getCode()).json({ code: e.getCode(), message: e.message });
                return;
            }
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: (e as Error).message });
        }
    }
}