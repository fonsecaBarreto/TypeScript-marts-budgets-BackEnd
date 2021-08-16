"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeItemView = void 0;
const MakeItemView = (categoryRepository) => {
    return async (product) => {
        if (!product)
            return;
        const categoryResult = !product.category_id ? null : await categoryRepository.find({ id: product.category_id });
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id } : { label: "", value: "" };
        return { ...product, category };
    };
};
exports.MakeItemView = MakeItemView;
