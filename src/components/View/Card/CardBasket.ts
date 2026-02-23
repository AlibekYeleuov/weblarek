import { ensureElement } from '../../../utils/utils';
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
        private onDelete: () => void
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
        this.deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onDelete();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
    set price(value: number | null) {
        this.priceElement.textContent =
        value !== null ? `${value} синапсов` : 'Бесценно';
    }
}
