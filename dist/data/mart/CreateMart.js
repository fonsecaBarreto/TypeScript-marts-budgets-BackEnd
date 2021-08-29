"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../../domain/protocols/Errors");
const MartsErrors_1 = require("../../domain/protocols/Errors/MartsErrors");
class CreateMart {
    constructor(martsRepository, idGenerator, hasher, addressRepository, createCheckList) {
        this.martsRepository = martsRepository;
        this.idGenerator = idGenerator;
        this.hasher = hasher;
        this.addressRepository = addressRepository;
        this.createCheckList = createCheckList;
    }
    async checkDuplicity(cnpj_cpf, email, phone, corporate_name, financial_email, mart) {
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
        if (corporate_name) {
            const corporateNameExists = await this.martsRepository.find({ corporate_name });
            if (corporateNameExists) {
                if ((!mart) || mart.corporate_name !== corporate_name)
                    throw MartsErrors_1.CorporateNameInUseError();
            }
        }
        if (financial_email) {
            const financialEmailExits = await this.martsRepository.find({ financial_email });
            if (financialEmailExits) {
                if ((!mart) || mart.financial_email !== financial_email)
                    throw MartsErrors_1.FinancialEmailInUseError();
            }
        }
    }
    async update(params) {
        const { id, cnpj_cpf, name, email, phone, transfer_allowed, corporate_name, financial_email, obs, responsible_name } = params;
        const mart = await this.martsRepository.find({ id });
        if (!mart)
            throw Errors_1.MartNotFoundError();
        await this.checkDuplicity(cnpj_cpf, email, phone, corporate_name, financial_email, mart);
        await this.martsRepository.update({ id }, { cnpj_cpf, name, email, phone, transfer_allowed, corporate_name, financial_email, obs, responsible_name });
        const rescued = await this.martsRepository.find({ id });
        return rescued;
    }
    async execute(params) {
        const { cnpj_cpf, name, email, phone, password, transfer_allowed, image, obs, address_id, corporate_name, financial_email, responsible_name } = params;
        const addressExits = await this.addressRepository.find({ id: address_id });
        if (!addressExits)
            throw Errors_1.AddressNotFoundError();
        const id = await this.idGenerator.generate();
        const password_hash = password ? await this.hasher.hash(password) : null;
        const mart = {
            image, transfer_allowed,
            id, cnpj_cpf, name, email, phone, password: password_hash,
            address_id, corporate_name, financial_email, responsible_name, obs,
        };
        await this.martsRepository.insert(mart);
        await this.createCheckList.execute({ mart_id: id });
        const rescued = await this.martsRepository.find({ id });
        return rescued;
    }
}
exports.default = CreateMart;
