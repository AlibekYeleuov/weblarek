import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<unknown> { 
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.listElement = ensureElement<HTMLElement>
        ('.basket__list',
        this.container
        );
        this.priceElement = ensureElement<HTMLElement>
        ('.basket__price',
        this.container
        );
        this.orderButton = ensureElement<HTMLButtonElement>
        ('.basket__button',
        this.container
        );
        this.orderButton.addEventListener('click', () => {
        this.events.emit('order:open');
        });
    }
    set items(elements: HTMLElement[]) {
        this.listElement.replaceChildren();

        const isEmpty = elements.length === 0;
        this.orderButton.disabled = isEmpty;

        if (isEmpty) {
            const empty = document.createElement('li');
            empty.className = 'basket__empty';
            empty.textContent = 'Корзина пуста';
            this.listElement.append(empty);
            return;
        }

        this.listElement.append(...elements);
    }
    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }
}