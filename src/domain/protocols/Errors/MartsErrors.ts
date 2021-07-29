import ApplicationError from './ApplicationError'

export const MartNotFoundError = () => (
    new ApplicationError('MartNotFoundError', "Não há registros em nosso sistema", {'credentials': "Empresa Desconhecida."}))

export const EmailInUseError = () => (
    new ApplicationError('EmailInUseError', "O email que você inseriu está em uso", {'email': "Email está em uso"}))

export const CpfCnpjInUseError = () => (
    new ApplicationError('CpfCnpjInUseError', "Já existe Conta cadastrado a esse documento", {'cnpj_cpf': "documento em uso"}))

export const PhoneInUseError = () => (
    new ApplicationError('PhoneInUseError', "Numero de Telefone já está em uso", {"phone": "Numero de Telefone já cadastrado"}))

export const MartNotVerifiedError = () => (
    new ApplicationError('MartNotVerifiedError', "Aguarde a Validação da conta. Você recebera um E-mail em breve"))

export const MartAlreadyVerifiedError = () => (
    new ApplicationError('MartAlreadyVerifiedError', "Conta Mercado Já foi verificado."))
    
    /*  */
