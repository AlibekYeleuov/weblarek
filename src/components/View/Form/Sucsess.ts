import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected description: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButton.addEventListener('click', () => {
        this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}