"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FindMart {
    constructor(martsRepository) {
        this.martsRepository = martsRepository;
    }
    async execute(id) {
        if (id) {
            const mart = await this.martsRepository.find({ id });
            return mart;
        }
        return await this.martsRepository.list({});
    }
}
exports.default = FindMart;
