import ApplicationError from './ApplicationError'

export const InvalidRequestBodyError = (errors: Record<string, string>) => (
    new ApplicationError("InvalidRequestBodyError", "Preencha todos os campos corretamente!", errors))

export const AccessDeniedError = () => (
    new ApplicationError('AccessDeniedError', "Acesso negado"))

export const SessionExpiredError = (message?:string) => (
    new ApplicationError('SessionExpiredError', message || "A seção foi expirada"))


export const DisagreementPasswordError = () => (
    new ApplicationError('DisagreementPasswordError', "Senha e confirmação devem ser iguais"))

export const ServerError = () => (
        new ApplicationError('ServerError', "Erro no servidor"))


/* files */
export const InvalidFileBufferError = (types:string[], limit: number, param: string) => {
    const list = types.map(t=>(` .${t.substring(t.lastIndexOf("/")+1, t.length )}`)) 
    const limitMb = (limit / (1024 * 1024 )).toFixed(2);
    const message = `Somente arquivos de extesão (${ list} ) e tamanho maximo de ${limitMb} Mb.`
    return new ApplicationError('InvalidFileBufferError',  message, { [param]: message })
}
export const MissingFileBufferError = (param: string) => {
    return new ApplicationError('MissingFileBufferError',  `Arquivo não encontrado.`, {[param]:'Arquivo não encontrado.'})
}
