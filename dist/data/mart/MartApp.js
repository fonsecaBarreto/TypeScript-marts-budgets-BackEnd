"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MartApp = void 0;
const Errors_1 = require("../../domain/protocols/Errors");
class MartApp {
    constructor(martRepository) {
        this.martRepository = martRepository;
    }
    async exists(id) {
        const mart = await this.martRepository.find({ id });
        if (!mart)
            throw Errors_1.MartNotFoundError();
    }
    async remove(id) {
        await this.exists(id);
        await this.martRepository.remove({ id });
        return;
    }
    async find(id) {
        if (id) {
            const mart = await this.martRepository.find({ id });
            return mart;
        }
        return await this.martRepository.list({});
    }
}
exports.MartApp = MartApp;
