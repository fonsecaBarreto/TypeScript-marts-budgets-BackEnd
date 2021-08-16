"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProductSearchView = exports.MakeProductSearchView = void 0;
const MakeProductSearchView = (brandsRepository, categoryRepository) => {
    return async (product) => {
        const categoryResult = !product.category_id ? null : await categoryRepository.find({ id: product.category_id });
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id } : null;
        const brandResult = !product.brand_id ? null : await brandsRepository.find({ id: product.brand_id });
        const brand = brandResult ? { label: brandResult.name, value: brandResult.id } : null;
        const { id, description, presentation, image } = product;
        const model = {
            id, description, presentation, image, category, brand
        };
        return model;
    };
};
exports.MakeProductSearchView = MakeProductSearchView;
const mapProductSearchView = (products, serializer) => {
    if (!products && products.length === 0)
        return Promise.resolve([]);
    return Promise.all(products.map(p => {
        return serializer(p);
    }));
};
exports.mapProductSearchView = mapProductSearchView;
//create a Productview Serializer
