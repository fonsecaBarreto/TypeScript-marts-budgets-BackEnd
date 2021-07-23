import { PasswordGenerator } from "../domain/vendors/Utils";
import generatePassword from 'password-generator'

export default class PasswordGeneratorAdapter implements PasswordGenerator {
    async generate(): Promise<string> {
        return generatePassword()
    }
}