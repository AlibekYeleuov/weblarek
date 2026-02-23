import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { Card } from './Card';
import { CDN_URL } from '../../../utils/constants';

interface ICardPreview {
    title: string;
    description: string;
    image: string;
    category: keyof typeof categoryMap;
    price: number | null;
    buttonText?: string;
}

export class CardPreview extends Card<ICardPreview> {
    protected descriptionElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    constructor(container: HTMLElement, private onAction: () => void) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>(
        '.card__text',
        this.container
        );
        this.categoryElement = ensureElement<HTMLElement>(
        '.card__category',
        this.container
        );
        this.buttonElement = ensureElement<HTMLButtonElement>(
        '.card__button',
        this.container
        );
        this.buttonElement.addEventListener('click', () => {
            this.onAction();
        });
        this.imageElement = ensureElement<HTMLImageElement>(
        '.card__image',
        this.container
        );
    }
    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
    set category(value: keyof typeof categoryMap) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = `card__category ${categoryMap[value]}`;
    }
    set price(value: number | null) {
        super.price = value;
        this.buttonElement.disabled = value === null;
    }
    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }
    set image(value: string) {
        this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? '');
    }
}