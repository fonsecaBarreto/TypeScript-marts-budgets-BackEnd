
export namespace XlsParserAdapter {
    export type SerialSchema = Record<string, string>
    export type ReadParams = {
        file: Buffer,
        sheetName: string,
    }
    export type WriteParams = {
        json: any,
        sheetName: string,
    }

    export type ReadResult  = {
        list: Record<string, string>[]
        malformedList: Record<string, string>[]
    }
    export type WriteResult = any
}

export interface XlsParserAdapter {
    read(params: XlsParserAdapter.ReadParams): any
    write(params: XlsParserAdapter.WriteParams): any
}