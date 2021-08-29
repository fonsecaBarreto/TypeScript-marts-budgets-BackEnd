"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSuggestion = void 0;
class CreateSuggestion {
    constructor(idGenerator, repository) {
        this.idGenerator = idGenerator;
        this.repository = repository;
    }
    async execute(params) {
        const id = await this.idGenerator.generate();
        const { mart_id, items } = params;
        const suggestion = {
            id,
            mart_id,
            items: JSON.stringify(items)
        };
        await this.repository.insert(suggestion);
        return await this.repository.find({ id });
    }
}
exports.CreateSuggestion = CreateSuggestion;
