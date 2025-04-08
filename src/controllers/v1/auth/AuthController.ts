import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { Request, Response } from 'express';
import { User, UserModel } from '../../../models/User';
import SpotifyAuthService from '../../../services/SpotifyAuthService';
import { getTokenFromCookie } from '../../../utils/utils';
import SpotifyClient from '../../../utils/SpotifyClient';

@autoInjectable()
export class AuthController extends BaseController {
    private spotifyAuthService: SpotifyAuthService;
    private spotifyClient: SpotifyClient;

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
                const isTokenValid = this.jwtService.verifyJWT(user.token);
                if (isTokenValid) {
                    await UserModel.updateOne({ _id: user._id }, {lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', user.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000
                    });
                } else {
                    const token = this.jwtService.createJWT(email);
                    await UserModel.updateOne({ _id: user._id }, {token: token, lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000
                    });
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

            if (!spotifyUser) throw new Error('Couldnt find user on spotify!');

            const user = await UserModel.findOne({ email: spotifyUser.email });
            const token = this.jwtService.createJWT(spotifyUser.email);
            const now = new Date(Date.now());

            if (!user) {
                const newUser = new User(
                    spotifyUser.email, 
                    token,
                    now,
                    now,
                    resp);
                
                await UserModel.create(newUser);
                res.cookie('API_TOKEN', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                });
                res.redirect('http://localhost:3000');
                return;
            } else {
                await UserModel.updateOne({ _id: user._id }, { ...user.toObject(), lastLoggedIn: now, token, resp });

            }

            res.cookie('API_TOKEN', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000
            });
            res.redirect('http://localhost:3000');
        } catch (e) {
            this.logger.error((e as Error).message);
            res.status(500).json({ code: 500, message: (e as Error).message });
        }

    } 
}