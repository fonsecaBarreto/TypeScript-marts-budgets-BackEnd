"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../../domain/protocols/Errors");
class CreateMart {
    constructor(martsRepository, idGenerator, hasher) {
        this.martsRepository = martsRepository;
        this.idGenerator = idGenerator;
        this.hasher = hasher;
    }
    async checkDuplicity(cnpj_cpf, email, phone, mart) {
        const emailExists = await this.martsRepository.find({ email });
        if (emailExists) {
            if ((!mart) || mart.email !== email)
                throw Errors_1.EmailInUseError();
        }
        const documentExists = await this.martsRepository.find({ cnpj_cpf });
        if (documentExists) {
            if ((!mart) || mart.cnpj_cpf !== cnpj_cpf)
                throw Errors_1.CpfCnpjInUseError();
        }
        if (phone) {
            const phoneExists = await this.martsRepository.find({ phone });
            if (phoneExists) {
                if ((!mart) || mart.phone !== phone)
                    throw Errors_1.PhoneInUseError();
            }
        }
    }
    async update(params) {
        const { id, cnpj_cpf, name, email, phone, annex, transfer_allowed, image } = params;
        const mart = await this.martsRepository.find({ id });
        if (!mart)
            throw Errors_1.MartNotFoundError();
        await this.checkDuplicity(cnpj_cpf, email, phone, mart);
        await this.martsRepository.update({ id }, { cnpj_cpf, name, email, phone, annex, transfer_allowed, image });
        const rescued = await this.martsRepository.find({ id });
        return rescued;
    }
    async execute(params) {
        const { cnpj_cpf, name, email, phone, password, annex, transfer_allowed, image } = params;
        await this.checkDuplicity(cnpj_cpf, email, phone);
        const id = await this.idGenerator.generate();
        const password_hash = password ? await this.hasher.hash(password) : null;
        const mart = {
            image, annex, transfer_allowed,
            id, cnpj_cpf, name, email, phone, password: password_hash
        };
        await this.martsRepository.insert(mart);
        const rescued = await this.martsRepository.find({ id });
        return rescued;
    }
}
exports.default = CreateMart;
