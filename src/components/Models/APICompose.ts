import type { IApi, IProduct, IProductsResponse, IOrder, IOrderResult } from '../../types/index';

export class APICompose {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IProductsResponse>('/product/').then((data) => data.items);
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}