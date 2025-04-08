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
}
