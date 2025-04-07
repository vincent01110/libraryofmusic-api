export interface LoginUser {
    user: {
        email: string;
    },
    expires: string;
    access_token: string;
}