import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';

import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { APICompose } from './components/Models/APICompose';

import { Modal } from './components/View/Modal';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Galery';

import { CardCatalog } from './components/View/Card/CardCatalog';
import { CardPreview } from './components/View/Card/CardPreview';
import { CardBasket } from './components/View/Card/CardBasket';

import { BasketView } from './components/View/BasketView';
import { ContactsForm } from './components/View/Form/ContactsForm';
import { OrderForm } from './components/View/Form/OrderForm';
import { Success } from './components/View/Form/Sucsess';

import { IProduct } from './types';
import { TPayment } from './types';

function cloneTemplate<T extends HTMLElement>(id: string): T {
    const template = document.querySelector(`#${id}`) as HTMLTemplateElement | null;
    if (!template) {
        throw new Error(`Template #${id} not found`);
    }
    const node = template.content.firstElementChild?.cloneNode(true);
    if (!node) {
        throw new Error(`Template #${id} is empty`);
    }
    return node as T;
}

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const baseApi = new Api(API_URL);
const apiCompose = new APICompose(baseApi);

const headerContainer = document.querySelector('.header') as HTMLElement | null;
if (!headerContainer) throw new Error('Header container .header not found');
const header = new Header(events, headerContainer);

const galleryContainer = document.querySelector('.gallery') as HTMLElement | null;
if (!galleryContainer) throw new Error('Gallery container .gallery not found');
const gallery = new Gallery(galleryContainer);

const modalContainer = document.querySelector('#modal-container') as HTMLElement | null;
if (!modalContainer) throw new Error('Modal container #modal-container not found');
const modal = new Modal(events, modalContainer);

const basketView = new BasketView(events, cloneTemplate<HTMLElement>('basket'));
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('contacts'), events);

apiCompose
    .getProducts()
    .then((items) => {
        catalog.setItems(items);
        console.log('Каталог, полученный с сервера и сохранённый в модель:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при получении каталога с сервера:', err);
});

events.on('modal:close', () => modal.close());

events.on('catalog:changed', () => {
    const items = catalog.getItems();

    const cards = items.map((item: IProduct) => {
        const element = cloneTemplate<HTMLElement>('card-catalog');
        const card = new CardCatalog(element, events);
        return card.render(item);
    });

    gallery.render({ items: cards });
});

events.on('card:toggle', ({ id }: { id: string }) => {
    const item = catalog.getItemById(id) || basket.getItems().find((i) => i.id === id);
    if (!item) return;
    basket.hasItem(id) ? basket.removeItem(item) : basket.addItem(item);
    modal.close();
});

events.on('catalog:preview-changed', () => {
    const item = catalog.getPreview();
    if (!item) return;

    const element = cloneTemplate<HTMLElement>('card-preview');
    const preview = new CardPreview(element, events);

    const isInBasket = basket.hasItem(item.id);

    preview.render({
        ...item,
        buttonText: isInBasket ? 'Удалить из корзины' : 'Купить'
    });

    modal.render({ content: preview.render(item) });
    modal.open();
});

function renderBasket() {
    const items = basket.getItems();

    const cards = items.map((item, index) => {
        const element = cloneTemplate<HTMLElement>('card-basket');
        const card = new CardBasket(element, events);

        return card.render({
        index: index + 1,
        title: item.title,
        price: item.price,
        id: item.id,
        } as any);
    });
    basketView.render({
        items: cards,
        total: basket.getTotalPrice(),
    } as any);
}

events.on('basket:open', () => {
    renderBasket();
    modal.render({ content: basketView.render() });
    modal.open();
});

events.on('basket:changed', () => {
    renderBasket();
    header.render({ counter: basket.getCount() });
});

events.on('basket:item-remove', ({ id }: { id: string }) => {
    const item = basket.getItems().find((i) => i.id === id);
    if (!item) return;
    basket.removeItem(item);
});

events.on('buyer:changed', () => {
    const errors = buyer.validate();

    orderForm.payment = buyer.getData().payment as TPayment | null;
    orderForm.address = buyer.getData().address;

    const orderErrors: string[] = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);

    orderForm.errors = orderErrors.join(', ');
    orderForm.valid = orderErrors.length === 0;

    contactsForm.email = buyer.getData().email;
    contactsForm.phone = buyer.getData().phone;

    const contactsErrors: string[] = [];
    if (errors.email) contactsErrors.push(errors.email);
    if (errors.phone) contactsErrors.push(errors.phone);

    contactsForm.errors = contactsErrors.join(', ');
    contactsForm.valid = contactsErrors.length === 0;
});

events.on('card:select', ({ id }: { id: string }) => {
    const item = catalog.getItemById(id);
    if (!item) return;
    catalog.setPreview(item);
});

events.on('order:open', () => {
    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on('payment:select', ({ payment }: { payment: TPayment }) => {
    buyer.setData({ payment });
});

events.on('order:change', ({ field, value }: { field: 'address'; value: string }) => {
    buyer.setData({ [field]: value } as any);
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('contacts:change', ({ field, value }: { field: 'email' | 'phone'; value: string }) => {
    buyer.setData({ [field]: value } as any);
});

events.on('success:close', () => {
  modal.close();
});

events.on('contacts:submit', () => {
    const buyerData = buyer.getData();
    const items = basket.getItems().map((i) => i.id);
    const total = basket.getTotalPrice();

    const order = {
        ...buyerData,
        items,
        total
    };

    apiCompose
        .postOrder(order as any)
        .then(() => {
            basket.clear();
            buyer.clear();

            const successEl = cloneTemplate<HTMLElement>('success');
            const success = new Success(events, successEl);

            modal.render({ content: success.render({ total }) });
            modal.open();
        })
        .catch((err) => {
            console.error('Ошибка при отправке заказа:', err);
        });
});