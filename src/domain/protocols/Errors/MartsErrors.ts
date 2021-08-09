import ApplicationError from './ApplicationError'

export const MartNotFoundError = () => (
    new ApplicationError('MartNotFoundError', "Não há registros em nosso sistema", {'credentials': "Empresa Desconhecida"}))

export const EmailInUseError = () => (
    new ApplicationError('EmailInUseError', "Este E-mail já está em uso", {'email': "Email está em uso"}))

export const FinancialEmailInUseError = () => (
    new ApplicationError('FinancialEmailInUseError', "Este E-mail já está em uso", {'financial_email': "Email está em uso"}))

export const CpfCnpjInUseError = () => (
    new ApplicationError('CpfCnpjInUseError', "Já existe Conta cadastrada para esse documento", {'cnpj_cpf': "documento está em uso"}))

export const PhoneInUseError = () => (
    new ApplicationError('PhoneInUseError', "Número de telefone já está em uso", {"phone": "Número de telefone já cadastrado"}))

export const MartNotVerifiedError = () => (
    new ApplicationError('MartNotVerifiedError', "Aguarde a Validação da conta. Você recebera um E-mail em breve"))

export const MartAlreadyVerifiedError = () => (
    new ApplicationError('MartAlreadyVerifiedError', "Conta Mercado Já foi verificado."))
    
export const CorporateNameInUseError = () => (
    new ApplicationError('CorporateNameInUseError', "Razão social já está em uso", {'corporate_name': "Razão social já está em uso"}))

    /*  */
