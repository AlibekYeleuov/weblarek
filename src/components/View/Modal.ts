import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

type IModalData = {
    content: HTMLElement;
}

export class Modal extends Component<unknown> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.closeButton = this.container.querySelector('.modal__close')!;
        this.content = this.container.querySelector('.modal__content')!;
        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
        this.container.addEventListener('click', (evt) => {
            if (evt.target === this.container) {
                this.events.emit('modal:close');
            }
        });
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
                this.events.emit('modal:close');
            }
        });
    }
    set contentElement(value: HTMLElement) {
        this.content.replaceChildren(value);
    }
    render(data?: Partial<IModalData>): HTMLElement {
        if (data?.content) {
            this.contentElement = data.content;
        }
        return this.container;
    }
    open(): void {
        this.container.classList.add('modal_active');
    }
    close() {
        this.container.classList.remove('modal_active');
        this.content.replaceChildren();
    }
}