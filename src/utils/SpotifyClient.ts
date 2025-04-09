import { autoInjectable } from 'tsyringe';
import Logger from './Logger';
import { Spotify } from '../models/interfaces/ISpotify';
import SpotifyAPIError from '../models/errors/SpotifyAPIError';
import xss from 'xss';

@autoInjectable()
export default class SpotifyClient {
    private readonly apiUrl: string;
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.apiUrl = 'https://api.spotify.com/v1';
    }

    public async getUserInfo(accessToken: string): Promise<Spotify.User.UserInfo>  {
        const response = await this.GET<Spotify.User.UserInfo>('/me', accessToken);

        return response;
    }

    public async getUserAlbums(accessToken: string, limit: number, offset: number): Promise<Spotify.Album.UserAlbums> {
        const response = await this.GET<Spotify.Album.UserAlbums>('/me/albums', accessToken, limit, offset);

        return response;
    }

    public async getAlbum(accessToken: string, id: string) {
        const response = await this.GET<Spotify.Album.Album>(`/albums/${id}`, accessToken);

        return response;
    }

    public async queryAlbums(accessToken: string, query: string, limit: number, offset: number) {
        const cleanQuery = xss(query);
        const response = await fetch(
            `${this.apiUrl}/search?q=${encodeURIComponent(cleanQuery)}&type=album&limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        
        const rawBody = await response.json();

        if (!response.ok) throw new SpotifyAPIError(rawBody.message, response.status);

        return rawBody as Spotify.Album.UserAlbums;
    }

    private async GET<T>(path: string, accessToken: string, limit?: number, offset?: number): Promise<T> {
        const url = limit && offset ? 
            `${this.apiUrl}${path}?limit=${limit}&offset=${offset}` 
            : `${this.apiUrl}${path}`;


        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const rawBody = await response.json();

        if (!response.ok) throw new SpotifyAPIError(rawBody.message, response.status);

        return rawBody as T;
    }
}