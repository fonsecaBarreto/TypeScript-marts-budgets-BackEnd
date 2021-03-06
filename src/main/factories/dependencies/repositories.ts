import KnexAdapter from '../../../libs/KnexAdapter'
import { MartsKnexPostgresRepository, OrdersKnexPostgresRepository, ProductsKnexPostgresRepository } from '../../../infra/repositories/KnexPostgres'
export const repositories = {
    martsRepository: new KnexAdapter('marts'),
    providersRepository: new KnexAdapter('providers'),
    adminsRepository: new KnexAdapter('admins'),
    categoriesRepository: new KnexAdapter('categories'),
    productsRepository: new KnexAdapter('products'),
    ordersRepository: new KnexAdapter('orders'),
    brandsRepository: new KnexAdapter('brands'),
    addressRepository: new KnexAdapter('addresses'),
    martannexsRepository: new KnexAdapter('mart_annexs'),
    itemsRepository: new KnexAdapter('product_items'),
    martsChecklistsRepository: new KnexAdapter('marts_checklists'),
    suggestionsRepository: new KnexAdapter('suggestions'),
    ratingRepository: new KnexAdapter('marts_rating')
}

export const infra = {
    ordersRepository: new OrdersKnexPostgresRepository(),
    martsRepository: new MartsKnexPostgresRepository(),
    productsRepository: new ProductsKnexPostgresRepository()
}