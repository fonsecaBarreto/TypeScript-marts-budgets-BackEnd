import { Hasher } from "../domain/vendors/Utils";
import bcrypt from 'bcryptjs'

export default class BcryptAdapter implements Hasher {
    hash(value: string): Promise<string> {
        return bcrypt.hash(value, 12)
    }
    compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash)
    }

}