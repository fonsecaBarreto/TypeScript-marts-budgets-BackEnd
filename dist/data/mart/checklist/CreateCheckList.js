"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckList = void 0;
class CreateCheckList {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(params) {
        const { mart_id } = params;
        const checkList = {
            mart_id,
            access_number: 0,
            first_suggestions: false,
            first_rating: false
        };
        await this.repository.insert(checkList);
        return await this.repository.find({ mart_id: mart_id });
    }
}
exports.CreateCheckList = CreateCheckList;
