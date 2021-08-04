import ApplicationError from './ApplicationError'

export const CorporateNameInUseError = () => (
    new ApplicationError('CorporateNameInUseError', "Razão social já está em uso", {'corporate_name': "Razão social já está em uso"}))

export const CnpjInUseError = () => (
    new ApplicationError('CnpjInUseError', "Já existe Conta cadastrada para esse CNPJ", {'cnpj_cpf': "CNPJ está em uso"}))

