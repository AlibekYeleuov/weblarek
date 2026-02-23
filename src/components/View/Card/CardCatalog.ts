import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { IProduct } from '../../../types';
import { CDN_URL } from '../../../utils/constants';

export class CardCatalog extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    constructor(container: HTMLElement, private onSelect: () => void) {
        super(container);
        this.categoryElement = ensureElement(
        '.card__category',
        this.container
        );
        this.imageElement = ensureElement<HTMLImageElement>(
        '.card__image',
        this.container
        );
        this.container.addEventListener('click', () => {
            this.onSelect();
    });
    }
    set category(value: keyof typeof categoryMap) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = `card__category ${categoryMap[value]}`;
    }
    set image(value: string) {
            this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? '');
    }
}