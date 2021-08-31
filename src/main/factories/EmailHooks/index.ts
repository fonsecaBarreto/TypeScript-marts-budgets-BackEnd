import keys from '../../config/keys'
import { SignUpEmailHook } from '../../../presentation/controllers/marts-controllers/emailhooks/index'
import { vendors } from '../dependencies'

export const signUpEmailHook = new SignUpEmailHook(vendors.mailer, keys.hook_email,keys.react_client)