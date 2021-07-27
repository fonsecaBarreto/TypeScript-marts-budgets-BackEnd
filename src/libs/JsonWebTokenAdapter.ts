import { Encrypter } from "../domain/vendors/Encrypter";
import { sign, verify  } from 'jsonwebtoken'
export default class JsonWebTokenAdapter implements Encrypter {
    constructor(
        private readonly secret:string
    ){}

    async sign(id: string, exp?:number): Promise<string> {
        const token = await sign({ id, exp: exp || Math.floor(Date.now() / 1000) + 604800 }, this.secret)
        return token
    }

    async decode(token: string): Promise<any> {
        var decoded = await verify(token, this.secret)
        return decoded
    }
}