"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMarts = exports.MakeMartPrivateView = void 0;
const MakeMartPrivateView = (addressRepository, annexsRepository, checklistsRepository) => {
    return async (mart) => {
        if (!mart)
            return;
        var checkList = null;
        const checkListExists = await checklistsRepository.find({ mart_id: mart.id });
        if (checkListExists) {
            checkList = checkListExists;
        }
        // Should i have a universal database seearker i think it is better this way
        const address = !mart.address_id ? null : await addressRepository.find({ id: mart.address_id });
        const annexes = await annexsRepository.list({ mart_id: mart.id });
        const novo = ({ ...mart, address, annexes, checkList, isActive: mart.password ? true : false });
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
