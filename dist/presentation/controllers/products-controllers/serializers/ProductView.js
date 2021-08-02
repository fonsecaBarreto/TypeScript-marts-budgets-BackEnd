"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeProductView = void 0;
const MakeProductView = (productRepository, categoryRepository) => {
    return async (product) => {
        const categoryResult = !product.category_id ? null : await categoryRepository.find({ id: product.category_id });
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id } : { label: "", value: "" };
        return { ...product, category };
    };
};
exports.MakeProductView = MakeProductView;
//create a Productview Serializer
