import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export abstract class Form<T> extends Component<T> {
	protected submitButton: HTMLButtonElement;
	protected errorElement: HTMLElement;
	constructor(container: HTMLFormElement, protected events: IEvents) {
			super(container);
			this.submitButton = container.querySelector('button[type="submit"]')!;
			this.errorElement = container.querySelector('.form__errors')!;
		}
	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}
	set errors(value: string) {
		this.errorElement.textContent = value;
	}
}