import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';

type ContactsField = 'email' | 'phone';

export class ContactsForm extends Form<unknown> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.emailInput.addEventListener('input', () => {
        this.events.emit('contacts:change', {
            field: 'email' as ContactsField,
            value: this.emailInput.value,
        });
        });
        this.phoneInput.addEventListener('input', () => {
        this.events.emit('contacts:change', {
            field: 'phone' as ContactsField,
            value: this.phoneInput.value,
        });
        });
        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit('contacts:submit');
        });
    }
    set email(value: string) {
        this.emailInput.value = value;
    }
    set phone(value: string) {
        this.phoneInput.value = value;
    }
}