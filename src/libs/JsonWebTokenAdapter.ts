import { Encrypter } from "../domain/vendors/Encrypter";
import { sign, verify  } from 'jsonwebtoken'
export default class JsonWebTokenAdapter implements Encrypter {
    constructor(
        private readonly secret:string
    ){}

    async sign(id: string): Promise<string> {
        try{
            const token = await sign({ id }, this.secret)
            return token
        }catch(err){ return null}
    }

    async decode(token: string): Promise<any> {
        try{
            var decoded = await verify(token, this.secret)
            return decoded
        }catch(err){ return null}
    }
}