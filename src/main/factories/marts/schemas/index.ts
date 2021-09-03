import { SchemaRow } from '../../../../data/ObjectValidator.ts/ObjectValidator.header'
import { FileSchema } from '../../../../presentation/helpers/FormDataParser'
import { FilesSchema, SignUp } from './signup-Schema.json'

export const signUpSchema: Record<string, SchemaRow> = SignUp
export const signUpfilesSchema: Record<string, FileSchema> = FilesSchema