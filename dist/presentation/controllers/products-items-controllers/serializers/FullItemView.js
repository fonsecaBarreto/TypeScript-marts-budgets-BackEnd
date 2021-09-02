"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapItems = exports.MakeItemFullView = void 0;
const MakeItemFullView = (categoryRepository, productsRepository, productSerializer) => {
    return async (item) => {
        if (!item)
            return;
        var category_name = "";
        var products = [];
        if (item.category_id) {
            let result = await categoryRepository.find({ id: item.category_id });
            if (result) {
                category_name = result.name;
            }
        }
        products = await productsRepository.list({ item_id: item.id });
        if (products.length > 0)
            [
                products = await Promise.all(products.map(async (p) => {
                    return await productSerializer(p);
                }))
            ];
        return { ...item, category_name, products };
    };
};
exports.MakeItemFullView = MakeItemFullView;
const mapItems = (items, serializer) => {
    if (!items && items.length === 0)
        return Promise.resolve([]);
    return Promise.all(items.map(async (i) => {
        return await serializer(i);
    }));
};
exports.mapItems = mapItems;
