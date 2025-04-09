/* eslint-disable @typescript-eslint/no-namespace */
export namespace Spotify {
    export namespace Auth {
        export interface Payload {
            access_token: string;
            token_type: string;
            expires_in: number;
            refresh_token: string;
            scope: string;
        }
    }

    export namespace User {
        interface UserImage {
            url: string,
            height: number,
            width: number
        }

        export interface UserInfo {
            country: string,
            display_name: string,
            email: string,
            explicit_content: {
                filter_enabled: boolean,
                filter_locked: boolean
            },
            external_urls: {
                spotify: string
            },
            followers: {
                href: string,
                total: number
            },
            href: string,
            id: string,
            images: UserImage[],
            product: string,
            type: string,
            uri: string

        }
    }

    export namespace Album {

        interface AlbumImage {
            url: string,
            height: number,
            width: number
        }

        interface Copyright {
            text: string,
            type: string
        }

        interface Artist {
            external_urls: {
                spotify: string
            },
            href: string,
            id: string,
            name: string,
            type: string,
            uri: string
        }

        interface TrackItem {
            artists: Artist[],
            available_markets: string[],
            disc_number: number,
            duration_ms: number,
            explicit: boolean,
            external_urls: {
                spotify: string
            },
            href: string,
            id: string,
            is_playable: boolean,
            linked_from: {
                external_urls: {
                    spotify: string
                },
                href: string,
                id: string,
                type: string,
                uri: string
            },
            restrictions: {
                reason: string
            },
            name: string,
            preview_url: string,
            track_number: number,
            type: string,
            uri: string,
            is_local: boolean
        }

        export interface Album {
            added_at: string,
            album: {
                album_type: string,
                total_tracks: number,
                available_markets: string[],
                external_urls: {
                    spotify: string
                },
                href: string,
                id: string,
                images: AlbumImage[],
                name: string,
                release_date: string,
                release_date_precision: string,
                restrictions: {
                    reason: string
                },
                type: string,
                uri: string,
                artists: Artist[],
                tracks: {
                    href: string,
                    limit: number,
                    next: string,
                    offset: number,
                    previous: string,
                    total: number,
                    items: TrackItem[]
                },
                copyrights: Copyright[],
                external_ids: {
                    isrc: string,
                    ean: string,
                    upc: string
                },
                genres: [],
                label: string,
                popularity: number
            }
        }

        export interface UserAlbums {
            href: string,
            limit: number,
            next: string,
            offset: number,
            previous: string,
            total: number,
            items: Album[],
        }
    }
}
