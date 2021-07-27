export interface Encrypter{
    sign(value:string, exp?:number): Promise<string>
    decode(token:string): Promise<any>
}