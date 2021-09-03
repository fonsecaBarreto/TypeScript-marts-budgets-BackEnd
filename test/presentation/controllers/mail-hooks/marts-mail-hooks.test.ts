import {config} from 'dotenv'
import { SignUpEmailHook, WelcomEmailEmailHook } from '../../../../src/presentation/controllers/mail-hooks/marts-mail-hooks'
import NodeMailer from '../../../../src/libs/NodeMailerAdapter'
import { MakeFakeMart } from '../../../stubs/MakeFakeMart'
config()
const makeSut = () =>{
    const email = process.env.EMAIL_ADDRESS;
    const password = process.env.EMAIL_PASSWORD;
    const client  = 'http://localhost:3000'
    const nodeMailer = new NodeMailer(email, password)
    const signUpEmailHook = new SignUpEmailHook(nodeMailer,'lucasfonsecab@hotmail.com',client)
    const welcomeEmailHook = new WelcomEmailEmailHook(nodeMailer,client)
    return ({ signUpEmailHook, welcomeEmailHook })
}

describe("should send email", () =>{
    test('Should send a new mart notification e-mail', async () =>{
        const {signUpEmailHook,welcomeEmailHook} = makeSut()
        await signUpEmailHook.execute(MakeFakeMart())
        await welcomeEmailHook.execute(MakeFakeMart({email:"lucasfonsecab@hotmail.com"}))
    })
})