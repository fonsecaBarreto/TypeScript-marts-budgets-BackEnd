"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../domain/protocols/Errors");
const http_helper_1 = require("../presentation/helpers/http-helper");
class CreateNewMart {
    constructor(martsRepository, idGenerator, hasher) {
        this.martsRepository = martsRepository;
        this.idGenerator = idGenerator;
        this.hasher = hasher;
    }
    async checkDuplicity(cnpj_cpf, email, phone) {
        const emailExists = await this.martsRepository.find({ email });
        if (emailExists)
            throw Errors_1.EmailInUseError();
        const documentExists = await this.martsRepository.find({ cnpj_cpf });
        if (documentExists)
            throw Errors_1.CpfCnpjInUseError();
        if (phone) {
            const phoneExists = await this.martsRepository.find({ phone });
            if (phoneExists)
                throw Errors_1.PhoneInUseError();
        }
    }
    async execute(params) {
        const { cnpj_cpf, name, email, phone, password, annex, transfer_allowed, image } = params;
        await this.checkDuplicity(cnpj_cpf, email, phone);
        const id = await this.idGenerator.generate();
        const password_hash = await this.hasher.hash(password);
        const mart = {
            image, annex, transfer_allowed,
            id, cnpj_cpf, name, email, phone, password: password_hash
        };
        await this.martsRepository.insert(mart);
        const rescued = await this.martsRepository.find({ id });
        return http_helper_1.success('rescued');
    }
}
exports.default = CreateNewMart;
