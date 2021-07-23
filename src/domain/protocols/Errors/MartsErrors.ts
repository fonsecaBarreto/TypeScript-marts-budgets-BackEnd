import ApplicationError from './ApplicationError'

export const MartNotFoundError = () => (
    new ApplicationError('MartNotFoundError', "Não Existem Registros ", {'crendentials': "Empresa Desconhecida."}))
export const EmailInUseError = () => (
    new ApplicationError('EmailInUseError', "Email esta em uso", {'email': "Email em uso"}))
export const CpfCnpjInUseError = () => (
    new ApplicationError('CpfCnpjInUseError', "Já existe Estabelecimento cadastrado a esse documento", {'cnpj_cpf': "documento em uso"}))
export const PhoneInUseError = () => (
    new ApplicationError('PhoneInUseError', "Numero de Telefone já esta em uso", {"phone": "Numero de Telefone ja cadastrado"}))
