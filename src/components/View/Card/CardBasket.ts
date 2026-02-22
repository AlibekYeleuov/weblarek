import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Card } from './Card';

interface ICardBasket {
    index: number;
    title: string;
    price: number | null;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>(
        '.basket__item-index',
        this.container
        );
        this.deleteButton = ensureElement<HTMLButtonElement>(
        '.basket__item-delete',
        this.container
        );
        this.deleteButton.addEventListener('click', () => {
        this.events.emit('basket:item-remove', { id: this._id });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
    set title(value: string) {
        this.titleElement.textContent = value;
    }
    set price(value: number | null) {
        this.priceElement.textContent =
        value !== null ? `${value} синапсов` : 'Бесценно';
    }
}
