export interface Encrypter{
    sign(value:string): Promise<string>
    decode(token:string): Promise<any>
}