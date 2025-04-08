import { autoInjectable } from 'tsyringe';
import Logger from '../utils/Logger';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { SpotifyAuth } from '../models/SpotifyAuth';
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
        this.logger.debug(storedState);
        this.logger.debug(JSON.stringify(req.cookies));

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
            return await response.json() as SpotifyAuth;
        } catch (e) {
            this.logger.error('Error while fetching tokens: ' + (e as Error).message);
            throw new Error((e as Error).message);
        }
    }

    private generateRandomString(length: number): string{
        return randomBytes(Math.ceil(length / 2))
            .toString('hex')                       
            .slice(0, length); 
    }
}