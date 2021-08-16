"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMarts = exports.MakeMartPrivateView = void 0;
const MakeMartPrivateView = (addressRepository, annexsRepository) => {
    return async (mart) => {
        if (!mart)
            return;
        const address = !mart.address_id ? null : await addressRepository.find({ id: mart.address_id });
        const annexes = await annexsRepository.list({ mart_id: mart.id });
        const novo = ({ ...mart, address, annexes, isActive: mart.password ? true : false });
        delete novo.password;
        return novo;
    };
};
exports.MakeMartPrivateView = MakeMartPrivateView;
const MapMarts = (marts, serializer) => {
    if (marts.length === 0)
        return Promise.resolve([]);
    return Promise.all(marts.map(async (m) => {
        return serializer(m);
    }));
};
exports.MapMarts = MapMarts;
