export class ShelfDTO {
    private name: string;

    private items: unknown[];

    private color: string;

    constructor(name?: string, items?: unknown[], color?: string) {
        this.name = name ?? '';
        this.items = items ?? [];
        this.color = color ?? '';
    }
}