export interface LoginUser {
    user: {
        name: string;
        email: string;
        image: string;
    },
    expires: string;
    access_token: string;
}