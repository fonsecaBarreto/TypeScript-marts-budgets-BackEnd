import keys from '../../config/keys'
import { SignUpEmailHook, WelcomEmailEmailHook } from '../../../presentation/controllers/mail-hooks/marts-mail-hooks'
import { vendors } from '../dependencies'

export const signUpEmailHook = new SignUpEmailHook(vendors.mailer, keys.hook_email,keys.react_client)
export const martWelcomeEmailHook = new WelcomEmailEmailHook(vendors.mailer,keys.react_client)