export class ShelfDTO {
    private name: string;

    private color: string;

    constructor(name?: string, color?: string) {
        this.name = name ?? '';
        this.color = color ?? '';
    }
}