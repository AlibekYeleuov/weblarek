import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class BasketView extends Component<unknown> { 
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.listElement = this.container.querySelector('.basket__list')!;
        this.priceElement = this.container.querySelector('.basket__price')!;
        this.orderButton = this.container.querySelector('.basket__button')!;
        this.orderButton.addEventListener('click', () => {
        this.events.emit('order:open');
        });
    }
    set items(elements: HTMLElement[]) {
        this.listElement.replaceChildren(...elements);
    }
    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }
}