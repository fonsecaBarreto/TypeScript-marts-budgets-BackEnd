import keys from '../../config/keys'
import { authMartController, martSignInController } from '../marts'
import {  Request } from '../../../domain/protocols/http'
import { badRequest, forbidden, success, unauthorized } from "../../../presentation/helpers/http-helper"
import { InvalidRequestBodyError, MartNotFoundError } from "../../../domain/protocols/Errors"
import KnexAdapter from '../../../libs/KnexAdapter'
import { hashSync } from 'bcryptjs'

import { sign  } from 'jsonwebtoken'
import { SignIn as SignInSchema } from '../../../presentation/controllers/marts-controllers/Schemas.json'

export const makeRequest = (fields?: Partial<Request>): Request => ({
    headers: {},
    params: {},
    query: {},
    body: {},
    ...fields
})

describe("Mart Login", () =>{

    beforeAll(async ()=>{
        await KnexAdapter.resetMigrations()
        await KnexAdapter.connection('admins').insert({
            id: "admin_test_id",
            username: "admin_test",
            password: hashSync("123456")
        })
        await KnexAdapter.connection('marts').insert({
            id: "mart_test_id",
            name: "comercio_test",
            email: "comercio_test@mail.com",
            phone: "123456789",
            cnpj_cpf: "123456465",
            password: hashSync("123456")
        })
    })

    afterAll(async()=>{
        await KnexAdapter.close()
    })

    describe("Signin", () => {

       /*  authMartController, martSignInController */
        test('400 on Missing Params', async () =>{
            const result =await martSignInController.run(makeRequest())
            expect(result).toEqual(badRequest(InvalidRequestBodyError({})))
            expect(result.body.params).toEqual({
                credentials: SignInSchema.credentials.missingMessage,
                password : SignInSchema.password.missingMessage,
            })
        })

        test('400 on Invalid Params', async () =>{
            const result =await martSignInController.run(makeRequest({ body: { credentials: 123 }}))
            expect(result).toEqual(badRequest(InvalidRequestBodyError({})))
            expect(result.body.params).toEqual({
                credentials: SignInSchema.credentials.invalidMessage,
                password : SignInSchema.password.missingMessage,
            })
        })

        test('403, MartNotFOund on unknow admin', async () =>{
            const result =await martSignInController.run(makeRequest({ body: { credentials: "unknow_admin", password: "123456" }}))
            expect(result).toEqual(forbidden(MartNotFoundError()))
        })
 
        test('401 on wrong admin password', async () =>{
                const compareSpy = jest.spyOn(martSignInController.hasher,'compare')
                const result =await martSignInController.run(makeRequest({ body: { credentials: "123456465", password: "wrong_password" }}))
                expect(compareSpy).toHaveBeenCalledTimes(1) //garantes it wasnt unauthorized by the repository
                expect(result).toEqual(unauthorized())

        })
        test('200 should receive a succes token', async () =>{
                const result =await martSignInController.run(makeRequest({ body: { credentials: "comercio_test@mail.com", password: "123456" }}))
                expect(result.status).toBe(200)
                expect(result.body).toHaveProperty('accessToken')
            })
        })  
   
})