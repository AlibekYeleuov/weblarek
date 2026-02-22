import type { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(private events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (this.hasItem(item.id)) return;
        this.items.push(item);
        this.events.emit('basket:changed');
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter((i) => i.id !== item.id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}