"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeProductView = void 0;
const MakeProductView = (brandsRepository, itemsRepository) => {
    return async (product) => {
        if (!product)
            return;
        const itemResult = !product.item_id ? null : await itemsRepository.find({ id: product.item_id });
        const item = itemResult ? { label: itemResult.name, value: itemResult.id } : { label: "", value: "" };
        const brandResult = !product.brand_id ? null : await brandsRepository.find({ id: product.brand_id });
        const brand = brandResult ? { label: brandResult.name, value: brandResult.id } : { label: "", value: "" };
        return { ...product, item, brand };
    };
};
exports.MakeProductView = MakeProductView;
