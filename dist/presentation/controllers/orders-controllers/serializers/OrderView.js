"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOrderView = void 0;
const MakeOrderView = (martsRepository) => {
    return async (order) => {
        if (!order)
            return;
        const martResult = !order.mart_id ? null : await martsRepository.find({ id: order.mart_id });
        const mart = martResult ? { label: martResult.name, value: martResult.id } : { label: "", value: "" };
        return { ...order, mart };
    };
};
exports.MakeOrderView = MakeOrderView;
