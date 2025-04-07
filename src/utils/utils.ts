import { Request } from 'express';

export function getTokenFromCookie(req: Request): string | null {
    if (req.headers && req.headers.authorization) {
        return req.headers.authorization?.split(' ')[1] as string;
    }

    return null;
}

export function isIdValid(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}