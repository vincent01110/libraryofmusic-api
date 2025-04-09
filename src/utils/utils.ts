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

export function generateNRandomNums(n: number, max: number): number[] {
    const nums: number[] = [];
    while (nums.length < n) {
        const x = generateRandomNum(max);
        if (nums.indexOf(+x) === -1) nums.push(+x);
    }
    return nums;
}

function generateRandomNum(max: number): number {
    return Math.floor(Math.random() * (max + 1));
}