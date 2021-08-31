import path from 'path'
import keys from '../../config/keys'
import LocalFileStorage from '../../../data/LocalFileStorage'
import { Mailer } from '../../../domain/vendors/Mailer'
import S3FileRepository from '../../../libs/AWS/S3FileRepository'
import SharpAdapter from '../../../libs/Sharp/SharpAdapter'
import UuidAdapter from '../../../libs/UuidAdapter'
import PasswordGeneratorAdapter from '../../../libs/PasswordGeneratorAdapter'
import BcryptAdapter from '../../../libs/BcryptAdapter'
import JsonWebTokenAdapter from '../../../libs/JsonWebTokenAdapter'
import NodeMailerAdapter from '../../../libs/NodeMailerAdapter'
import { MailterStub } from './stubs/MailerStub'

export const fileRepository = new LocalFileStorage(path.join(__dirname,'..','..','..','uploads',keys.node_env))
export const amazonS3 = new S3FileRepository(keys.aws_uploads_bucket, keys.aws_access_key, keys.aws_secret_key, keys.aws_region)
export const sharpAdapter = new SharpAdapter()

export const vendors = {
    imageTransformer: sharpAdapter,
    idGenerator: new UuidAdapter(),
    passwordGenerator: new PasswordGeneratorAdapter(),
    fileRepository: keys.node_env === "development" ? fileRepository : amazonS3,
    mailer: keys.node_env === "development" ? new MailterStub() : new NodeMailerAdapter( keys.email_address, keys.email_password ),
    hasher: new BcryptAdapter(),
    encrypter: new JsonWebTokenAdapter(keys.jwt_secret)
}

