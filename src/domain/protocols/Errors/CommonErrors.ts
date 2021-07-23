import ApplicationError from './ApplicationError'

export const InvalidRequestBodyError = (errors: Record<string, string>) => (
    new ApplicationError("InvalidRequestBodyError", "Preencha todos os campos corretamente!", errors))

export const AccessDeniedError = () => (
    new ApplicationError('AccessDeniedError', "Acesso negado"))

export const ServerError = () => (
        new ApplicationError('ServerError', "Erro no servidor"))