"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRating = void 0;
class CreateRating {
    constructor(idGenerator, repository) {
        this.idGenerator = idGenerator;
        this.repository = repository;
    }
    async execute(params) {
        const id = await this.idGenerator.generate();
        var { mart_id, grade, description } = params;
        grade = grade > 5 ? 5 : grade < 0 ? 0 : grade;
        const suggestion = {
            id,
            mart_id,
            grade,
            description
        };
        await this.repository.insert(suggestion);
        return await this.repository.find({ id });
    }
}
exports.CreateRating = CreateRating;
