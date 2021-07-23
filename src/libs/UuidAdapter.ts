import { IdGenerator } from  "../domain/vendors/Utils";
import { v4 } from 'uuid'

export default class UuidAdapter implements IdGenerator {
    async generate(): Promise<string> {
        return v4()
    }
}