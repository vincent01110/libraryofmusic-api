export class ShelfDTO {
    private name: string;

    private artists: unknown[];

    private items: unknown[];

    private color: string;

    constructor(name?: string, artists?: unknown[], items?: unknown[], color?: string) {
        this.name = name ?? '';
        this.artists = artists ?? [];
        this.items = items ?? [];
        this.color = color ?? '';
    }
}