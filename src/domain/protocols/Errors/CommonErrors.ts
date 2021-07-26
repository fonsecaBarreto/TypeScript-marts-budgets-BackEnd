import ApplicationError from './ApplicationError'

export const InvalidRequestBodyError = (errors: Record<string, string>) => (
    new ApplicationError("InvalidRequestBodyError", "Preencha todos os campos corretamente!", errors))

export const AccessDeniedError = () => (
    new ApplicationError('AccessDeniedError', "Acesso negado"))

export const ServerError = () => (
        new ApplicationError('ServerError', "Erro no servidor"))


/* files */

export const InvalidFileBufferError = (types:string[], limit: number) => {
    const list = types.map(t=>(`'.${t.substring(t.lastIndexOf("/")+1, t.length )}'`)) 
    const limitMb = (limit / (1024 * 1024 )).toFixed(2)
    return new ApplicationError('InvalidFileBufferError',  `Somente arquivos de extesão (${ list}), e tamanho maximo de ${limitMb}Mb são permitidos.`)
}
export const MissingFileBufferError = () => {
    return new ApplicationError('MissingFileBufferError',  `Arquivo não encontrado.`)
}


    
export const unexpectedFileError = (param: string) =>{
    return new ApplicationError('unexpectedFileError',  `Arquivo '${param}' é Inesperado.`, { param: "Arquivo inesperado pelo sistema"})
}