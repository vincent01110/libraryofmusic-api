import { autoInjectable } from 'tsyringe';
import Logger from '../utils/Logger';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { SpotifyAuth } from '../models/SpotifyAuth';
import { Spotify } from '../models/interfaces/ISpotify';
import { UserModel } from '../models/User';
import UserNotFoundError from '../models/errors/UserNotFoundError';
dotenv.config();

@autoInjectable()
export default class SpotifyAuthService {
    private logger: Logger;
    private readonly stateKey = 'spotify_auth_state';
    private readonly clientId;
    private readonly clientSecret;
    private readonly redirectURI;

    constructor(logger: Logger) {
        this.logger = logger;
        this.clientId = process.env.SPOTIFY_CI;
        this.clientSecret = process.env.SPOTIFY_CS;
        this.redirectURI = process.env.SPOTIFY_REDIRECT_URI;
    }

    public async authorize(res: Response) {
        if (!this.clientId || !this.clientSecret || !this.redirectURI) throw new Error('Spotify app credentials not found!');

        const scopes = [
            'user-read-private',
            'user-read-email',
            'user-library-read',
        ].join(',');

        const state = this.generateRandomString(16);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            scope: scopes,
            redirect_uri: this.redirectURI,
            state: state,
        });

        res.cookie(this.stateKey, state, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // true in prod
        });


        res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
    }

    public async callback(req: Request, res: Response): Promise<SpotifyAuth> {
        const code = req.query.code || null;
        const state = req.query.state || null;
        const storedState = req.cookies ? req.cookies[this.stateKey] : null;

        if (!state || state !== storedState) throw new Error('State mismatch!');
        if (!this.clientId || ! this.clientSecret || !this.redirectURI) throw new Error('Spotify credentials missing!');

        res.clearCookie(this.stateKey);

        const authOptions = {
            method: 'POST',
            body: new URLSearchParams({
                code: String(code),
                redirect_uri: this.redirectURI,
                grant_type: 'authorization_code'
            }).toString(),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
            },
            json: true
        };

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
            const rawData = await response.json() as Spotify.Auth.Payload;
            const expiresAt = Date.now() + rawData.expires_in * 1000; 
            return new SpotifyAuth(rawData.access_token, rawData.token_type, rawData.scope, expiresAt, rawData.refresh_token);
        } catch (e) {
            this.logger.error('Error while fetching tokens: ' + (e as Error).message);
            throw new Error((e as Error).message);
        }
    }

    public async getAccessToken(email: string): Promise<string> {
        const user = await UserModel.findOne({ email: email });

        if (!user || !user.spotifyAuth) throw new UserNotFoundError('User not found!');

        if (user.spotifyAuth?.expiresAt < Date.now()) {
            return (await this.refreshToken(user.spotifyAuth.refreshToken)).accessToken;
        }

        return user.spotifyAuth.accessToken;
    }


    public async refreshToken(refreshToken: string): Promise<SpotifyAuth> {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')) 
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }).toString(), 
            });

            if (!response.ok) throw new Error('Couldnt get refresh token!');

            const newTokens: Spotify.Auth.Payload = await response.json();
            const authData = new SpotifyAuth(newTokens.access_token, newTokens.token_type, newTokens.scope, newTokens.expires_in, newTokens.refresh_token);

            return authData;
        } catch (e) {
            throw new Error((e as Error).message);
        }
    }

    private generateRandomString(length: number): string{
        return randomBytes(Math.ceil(length / 2))
            .toString('hex')                       
            .slice(0, length); 
    }
}