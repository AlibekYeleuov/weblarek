import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { APICompose } from './components/Models/APICompose';

import { apiProducts } from './utils/data';

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

//Проверка работоспособности:

//проверка каталога
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());
const firstItem = apiProducts.items[0];
console.log('Первый товар по id:', catalog.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390'));
catalog.setPreview(firstItem);
console.log('Выбраный товар:', catalog.getPreview());

//проверка корзины
console.log('Пустая корзина:', basket.getItems());
console.log('Товаров в пустой корзине:', basket.getCount());
console.log('Стоимость товаров в пустой корзине:', basket.getTotalPrice());

basket.addItem(firstItem);
console.log('Добавили товар в корзину:', basket.getItems());
console.log('Проверка наличия по id:', basket.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Теперь товаров в корзине:', basket.getCount());
console.log('Теперь стоимость товаров в корзине:', basket.getTotalPrice());
//добавим в корзину ещё один товар
const itemId1 = 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9';
const secondItem = catalog.getItemById(itemId1);
if (secondItem) {
    basket.addItem(secondItem);
    console.log('Добавили второй товар (addItem). Корзина:', basket.getItems());
    console.log('Количество товаров (getCount):', basket.getCount());
    console.log('Стоимость (getTotalPrice):', basket.getTotalPrice());
}
//удаляем товар
basket.removeItem(firstItem);
console.log('Удалили первый товар, что осталось:', basket.getItems());
const itemId2 = '854cef69-976d-4c2a-a18c-2aa45046c390';
console.log('Проверка наличия по id после удаления:', basket.hasItem(itemId2));
//очистка всей корзины
basket.clear();
console.log('Козина после очистки', basket.getItems());
console.log('Количество товаров в корзине после очистки:', basket.getCount());
console.log('Стоимость всех товаров после очистки:', basket.getTotalPrice());

//проверка покупателя
console.log('Ошибки валидации на пустых данных:', buyer.validate());
buyer.setData({ payment: 'card' });
console.log('Ошибки валидации после заполнения данных1:', buyer.validate());
buyer.setData({ address: 'Алматы, Достык 101' });
console.log('Ошибки валидации после заполнения данных2:', buyer.validate());
buyer.setData({ email: 'alik_test@mail.com' });
console.log('Ошибки валидации после заполнения данных3:', buyer.validate());
buyer.setData({ phone: '+8 (800) 555-35-35' });
console.log('Ошибки валидации после заполнения данных4:', buyer.validate());
console.log('Данные покупателя (getData):', buyer.getData());
buyer.clear();
console.log('После clear() ошибки validate:', buyer.validate());

//проверка API
const baseApi = new Api(API_URL);
const apiCompose = new APICompose(baseApi);

apiCompose
    .getProducts()
    .then((items) => {
        catalog.setItems(items);
        console.log('Каталог, полученный с сервера и сохранённый в модель:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при получении каталога с сервера:', err);
    });