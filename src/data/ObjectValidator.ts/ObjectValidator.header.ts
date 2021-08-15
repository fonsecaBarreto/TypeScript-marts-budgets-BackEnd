
export interface SchemaRow {
    type: string,
    optional?: boolean,
    label?:string,
    missingMessage?:string,
    invalidMessage?:string
}
export interface ErrorsParams extends Record<string, string> {}

export interface ObjectValidator {
    validate(body: Record<string, any>): Promise<ErrorsParams | null> ,
}





