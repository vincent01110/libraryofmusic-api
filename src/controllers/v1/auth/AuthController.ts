import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { CookieOptions, Request, Response } from 'express';
import { User, UserModel } from '../../../models/User';
import SpotifyAuthService from '../../../services/SpotifyAuthService';
import { getTokenFromCookie } from '../../../utils/utils';
import SpotifyClient from '../../../utils/SpotifyClient';
import SpotifyAPIError from '../../../models/errors/SpotifyAPIError';

@autoInjectable()
export class AuthController extends BaseController {
    private spotifyAuthService: SpotifyAuthService;
    private spotifyClient: SpotifyClient;
    private readonly maxAge = 172800000;
    private cookieConfig: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: this.maxAge,
        path: '/'
    };

    constructor(spotifyAuthService: SpotifyAuthService, spotifyClient: SpotifyClient) {
        super();
        this.spotifyAuthService = spotifyAuthService;
        this.spotifyClient = spotifyClient;

        this.login = this.login.bind(this);
        this.callback = this.callback.bind(this);
    }

    public async login(req: Request, res: Response) {
        try {
            const token = getTokenFromCookie(req);
            
            if (!token) {
                await this.spotifyAuthService.authorize(res);
                return;
            }

            const email = this.jwtService.getUser(token);

            const user = await UserModel.findOne({ email: email});

            if (!user) {
                await this.spotifyAuthService.authorize(res);
                return;
            } else {
                const isTokenValid = await this.jwtService.verifyJWT(user.token);
                if (isTokenValid) {
                    await UserModel.updateOne({ _id: user._id }, {lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', user.token, this.cookieConfig);
                } else {
                    const newToken = this.jwtService.createJWT(user.email);
                    await UserModel.updateOne({ _id: user._id }, {token: newToken, lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', newToken, this.cookieConfig);
                }
                res.redirect('http://localhost:3000');
                return;
            }
        } catch (e) {
            this.logger.error((e as Error).message);
        }
    }

    public async callback (req: Request, res: Response) {
        try {
            const resp = await this.spotifyAuthService.callback(req, res);

            const spotifyUser = await this.spotifyClient.getUserInfo(String(resp.accessToken));

            const user = await UserModel.findOne({ email: spotifyUser.email });
            const now = new Date(Date.now());
            
            if (!user) {
                const token = this.jwtService.createJWT(spotifyUser.email);
                const newUser = new User(
                    spotifyUser.email, 
                    token,
                    now,
                    now,
                    resp);
                
                await UserModel.create(newUser);
                res.cookie('API_TOKEN', token, this.cookieConfig);
            } else {
                const isTokenValid = await this.jwtService.verifyJWT(user.token);
                if (isTokenValid) {
                    await UserModel.updateOne({ _id: user._id }, {lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', user.token, this.cookieConfig);
                } else {
                    const newToken = this.jwtService.createJWT(user.email);
                    await UserModel.updateOne({ _id: user._id }, {token: newToken, lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', newToken, this.cookieConfig);
                }
            }
            res.redirect('http://localhost:3000');
        } catch (e) {
            if (e instanceof SpotifyAPIError) {
                res.status(e.getCode()).json({ code: e.getCode(), messsage: e.message });
            }
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: (e as Error).message });
        }

    } 
}