"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCheckList = void 0;
class UpdateCheckList {
    constructor(repository) {
        this.repository = repository;
    }
    async increaseAccessNumber(params) {
        const { mart_id } = params;
        const checkList = await this.repository.find({ mart_id });
        if (!checkList)
            return;
        await this.repository.update({ mart_id }, { access_number: checkList.access_number + 1 });
        return await this.repository.find({ mart_id: mart_id });
    }
    async setFirst_suggestions(params) {
        const { mart_id } = params;
        const checkList = await this.repository.find({ mart_id });
        if (!checkList || checkList.first_suggestions === true)
            return;
        await this.repository.update({ mart_id }, { first_suggestions: true });
        return await this.repository.find({ mart_id: mart_id });
    }
    async setFirst_Rating(params) {
        const { mart_id } = params;
        const checkList = await this.repository.find({ mart_id });
        if (!checkList || checkList.first_rating === true)
            return;
        await this.repository.update({ mart_id }, { first_rating: true });
        return await this.repository.find({ mart_id: mart_id });
    }
}
exports.UpdateCheckList = UpdateCheckList;
