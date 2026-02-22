import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';
import type { TPayment } from '../../../types';

export class OrderForm extends Form<unknown> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardButton.addEventListener('click', () => {
            this.events.emit('payment:select', { payment: 'card' as TPayment });
        });
        this.cashButton.addEventListener('click', () => {
            this.events.emit('payment:select', { payment: 'cash' as TPayment });
        });
        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:change', { field: 'address', value: this.addressInput.value });
        });
        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit('order:submit');
        });
    }
    set payment(value: TPayment | null) {
        const activeClass = 'button_alt-active';
        this.cardButton.classList.toggle(activeClass, value === 'card');
        this.cashButton.classList.toggle(activeClass, value === 'cash');
    }
    set address(value: string) {
        this.addressInput.value = value;
    }
}