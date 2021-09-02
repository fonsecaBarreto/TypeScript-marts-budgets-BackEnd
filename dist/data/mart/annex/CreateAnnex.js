"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateAnnex {
    constructor(idGenerator, fileRepository, annexsRepository) {
        this.idGenerator = idGenerator;
        this.fileRepository = fileRepository;
        this.annexsRepository = annexsRepository;
    }
    async execute(params) {
        const { buffer, contentType, mart_id, name } = params;
        const id = await this.idGenerator.generate();
        const fileStored = await this.fileRepository.save({
            buffer, contentType,
            name: `documents/${Date.now()}_${name}`
        });
        await this.annexsRepository.insert({
            id, mart_id, contentType, name: fileStored.name,
        });
        return true;
    }
}
exports.default = CreateAnnex;
