"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMartPrivateView = exports.MakeMartPrivateView = void 0;
const MakeMartPrivateView = (mart) => {
    if (!mart)
        return null;
    //aqui tave eu deveria resovler o image url e annex url
    const novo = ({ ...mart, isActive: mart.password ? true : false });
    delete novo.password;
    return novo;
};
exports.MakeMartPrivateView = MakeMartPrivateView;
const MapMartPrivateView = (marts) => {
    if (marts.length === 0)
        return Promise.resolve([]);
    marts.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
    return Promise.all(marts.map(async (m) => {
        return exports.MakeMartPrivateView(m);
    }));
};
exports.MapMartPrivateView = MapMartPrivateView;
