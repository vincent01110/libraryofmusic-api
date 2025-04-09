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
        const response = await fetch(`${this.apiUrl}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) throw new Error('Couldnt fetch user data!');

        const rawUser = await response.json();

        return rawUser as Spotify.User.UserInfo;
    }

    public async getUserAlbums(accessToken: string, limit: number, offset: number) {
        const response = await fetch(
            `${this.apiUrl}/me/albums?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (!response.ok) throw new Error('Couldnt fetch user albums!');

        const rawData = await response.json();

        return rawData as Spotify.Album.UserAlbums;
    }
}