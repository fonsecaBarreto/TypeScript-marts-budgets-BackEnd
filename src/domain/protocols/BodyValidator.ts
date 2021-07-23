export interface SchemaRow {
    type: string,
    size?: number,
    optional?: boolean,
    label?:string,
    missingMessage?:string,
    invalidMessage?:string
}
export interface ErrorsParams extends Record<string, string> {}

export interface BodyValidator {
    validate(body: Record<string, any>): Promise<ErrorsParams | null> ,
}
