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
import { IOrder } from './types';

import { cloneTemplate } from './utils/utils';

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

const basketView = new BasketView(events, cloneTemplate<HTMLElement>('#basket'));
basketView.render({ items: [], total: 0 });
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const previewElement = cloneTemplate<HTMLElement>('#card-preview');
const preview = new CardPreview(previewElement, () => {
  events.emit('preview:action');
});
const successElement = cloneTemplate<HTMLElement>('#success');
const success = new Success(events, successElement);

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
        const element = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(element, () => {
            events.emit('card:select', { id: item.id });
        });
        return card.render(item);
    });

    gallery.render({ items: cards });
});

events.on('preview:action', () => {
    const item = catalog.getPreview();
    if (!item) return;

    if(item.price === null) return;

    if (basket.hasItem(item.id)) {
        basket.removeItem(item);
    } else {
        basket.addItem(item);
    }
    modal.close();
});

events.on('catalog:preview-changed', () => {
    const item = catalog.getPreview();
    if (!item) return;

    const inBasket = basket.hasItem(item.id);

    const buttonText = 
        item.price === null 
        ? 'Недоступно' : inBasket 
        ? 'Удалить из корзины' : 'Купить';

    modal.render({
        content: preview.render({
            ...item,
            buttonText
        })
    });

    modal.open();
});

events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

events.on('basket:changed', () => {
    header.render({ counter: basket.getCount() });
    const items = basket.getItems();

    const cards = items.map((item, index) => {
        const element = cloneTemplate<HTMLElement>('#card-basket');
        const card = new CardBasket(element, () => {
        events.emit('basket:item-remove', { id: item.id });
        });

        return card.render({
        index: index + 1,
        title: item.title,
        price: item.price,
        });
    });
    basketView.render({ items: cards, total: basket.getTotalPrice() });
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

events.on('order:change', ({ value }: { field: 'address'; value: string }) => {
    buyer.setData({ address: value });
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('contacts:change', ({ field, value }: { field: 'email' | 'phone'; value: string }) => {
    if (field === 'email') {
        buyer.setData({ email: value});
    }
    if (field === 'phone') {
        buyer.setData({ phone: value});
    }
});

events.on('success:close', () => {
  modal.close();
});

events.on('contacts:submit', () => {
    const total = basket.getTotalPrice();

    const order: IOrder = {
        ...buyer.getData(),
        items: basket.getItems().map((i) => i.id),
        total
    };

    apiCompose
        .postOrder(order)
        .then(() => {
            basket.clear();
            buyer.clear();
            
            modal.render({ content: success.render({ total }) });
            modal.open();
        })
        .catch((err) => {
            console.error('Ошибка при отправке заказа:', err);
        });
});