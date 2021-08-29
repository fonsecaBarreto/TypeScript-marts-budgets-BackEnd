"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOrderProductView = void 0;
const MakeOrderProductView = (martsRepository, productsRepository, itemsRepository) => {
    return async (order) => {
        if (!order)
            return;
        var product = null;
        const martResult = !order.mart_id ? null : await martsRepository.find({ id: order.mart_id });
        var mart = martResult ? { label: martResult.name, value: martResult.id } : { label: "", value: "" };
        const productAux = await productsRepository.find({ id: order.product_id });
        if (productAux) {
            product = productAux;
        }
        return { ...order, mart, product };
    };
};
exports.MakeOrderProductView = MakeOrderProductView;
