"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProviders = exports.MakeProviderPrivateView = void 0;
const MakeProviderPrivateView = (addressRepository) => {
    return async (provider) => {
        if (!provider)
            return;
        const address = !provider.address_id ? null : await addressRepository.find({ id: provider.address_id });
        const novo = ({ ...provider, address });
        return novo;
    };
};
exports.MakeProviderPrivateView = MakeProviderPrivateView;
const mapProviders = (providers, serializer) => {
    if (providers.length === 0)
        return Promise.resolve([]);
    return Promise.all(providers.map(async (m) => {
        return serializer(m);
    }));
};
exports.mapProviders = mapProviders;
