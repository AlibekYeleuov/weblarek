import type { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Catalog {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit('catalog:preview-changed', { item });
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}