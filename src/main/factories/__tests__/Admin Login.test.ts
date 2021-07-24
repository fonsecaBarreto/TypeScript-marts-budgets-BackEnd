import keys from '../../config/keys'
import { adminSignInController, authAdminController } from '../admins'
import {  Request } from '../../../domain/protocols/http'
import { badRequest, success, unauthorized } from "../../../presentation/helpers/http-helper"
import { InvalidRequestBodyError } from "../../../domain/protocols/Errors"
import KnexAdapter from '../../../libs/KnexAdapter'
import { hashSync } from 'bcryptjs'

import { sign  } from 'jsonwebtoken'
export const makeRequest = (fields?: Partial<Request>): Request => ({
    headers: {},
    params: {},
    query: {},
    body: {},
    ...fields
})

describe("Admin Login", () =>{

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

    describe("Signin", () =>{
        test('400 on Missing Params', async () =>{
            const result =await adminSignInController.run(makeRequest())
            expect(result).toEqual(badRequest(InvalidRequestBodyError({})))
            expect(result.body.params).toEqual({
                username: "Campo de Nome de Usuario é obrigatorio",
                password : "Campo de Senha é obrigatorio"
            })
        })
        test('400 on Invalid Params', async () =>{
            const result =await adminSignInController.run(makeRequest({ body: { username: "Errado" }}))
            expect(result).toEqual(badRequest(InvalidRequestBodyError({})))
            expect(result.body.params).toEqual({
                password : "Campo de Senha é obrigatorio"
            })
        })

        test('401 on unknow admin', async () =>{
            const result =await adminSignInController.run(makeRequest({ body: { username: "unknow_admin", password: "123456" }}))
            expect(result).toEqual(unauthorized())
        })

    test('401 on wrong admin password', async () =>{
            const compareSpy = jest.spyOn(adminSignInController.hasher,'compare')
            const result =await adminSignInController.run(makeRequest({ body: { username: "admin_test", password: "wrong_password" }}))
            expect(compareSpy).toHaveBeenCalledTimes(1) //garantes it wasnt unauthorized by the repository
            expect(result).toEqual(unauthorized())

        })

    test('200 should receive a succes token', async () =>{
            const result =await adminSignInController.run(makeRequest({ body: { username: "admin_test", password: "123456" }}))
            expect(result.status).toBe(200)
            expect(result.body).toHaveProperty('accessToken')
        })

    })
    describe("auth", () =>{
        test('401 on Missing Authorization Header', async () =>{
            const result =await authAdminController.run(makeRequest())
            expect(result).toEqual(unauthorized())
        })
        test('401 on Inalid Authorization Token', async () =>{
            const result =await authAdminController.run(makeRequest({
                headers: { authorization: "asdasd"}
            }))
            expect(result).toEqual(unauthorized())
        })
        test('401 on Inalid Authorization Token', async () =>{

            const token =  await sign({ id: "mart_test_id" }, keys.jwt_secret)
      
            const result =await authAdminController.run(makeRequest({
                headers: { authorization: `Bearer ${token}`}
            }))
            expect(result).toEqual(unauthorized())
        })
        test('200 on valid token', async () =>{

            const token =  await sign({ id: "admin_test_id" }, keys.jwt_secret)
      
            const result =await authAdminController.run(makeRequest({
                headers: { authorization: `Bearer ${token}`}
            }))
            expect(result.status).toBe(200)

            expect(result.body).toEqual(
                expect.objectContaining({
                    id: "admin_test_id",
                    username: "admin_test"
                })
            )
        })



       
    })
})