import { autoInjectable } from 'tsyringe';
import Logger from './Logger';
import { Spotify } from '../models/interfaces/ISpotify';

@autoInjectable()
export default class SpotifyClient {
    private readonly apiUrl: string;
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.apiUrl = 'https://api.spotify.com/v1';
    }

    public async getUserInfo(accessToken: string): Promise<Spotify.User.UserInfo | null>  {
        try {
            const response = await fetch(`${this.apiUrl}/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });


            if (!response.ok) throw new Error('Couldnt fetch user!');

            const rawUser = await response.json();

            return rawUser as Spotify.User.UserInfo;
        } catch (e) {
            this.logger.error((e as Error).message);
            return null;
        }
    }
}