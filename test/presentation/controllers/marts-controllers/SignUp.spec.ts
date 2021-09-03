import { CreateMart } from "../../../../src/data/mart/CreateMart";
import { CreateAddress } from "../../../../src/data/address/CreateAdress";
import { CreateAnnex } from "../../../../src/data/mart/annex/CreateAnnex";
import { Addresses } from "../../../../src/domain/entities/Addresses";
import { BodyValidator, ErrorsParams, SchemaRow } from "../../../../src/domain/protocols/ControllerBateries";
import { SignUpMartController } from '../../../../src/presentation/controllers/marts-controllers/SignUp'
import { MartModel } from "../../../../src/domain/entities/MartModel";
import { MakeFakeAddress } from '../../../stubs/MakeFakeAddress'
import { MakeFakeMart } from '../../../stubs/MakeFakeMart'
import { InvalidRequestBodyError, ServerError } from "../../../../src/domain/protocols/Errors";
import { serverError, success } from "../../../../src/presentation/helpers/http-helper";

const makeSut = () => {

    class AddressValidatorStub implements BodyValidator {
        validate(body: Record<string, any>): Promise<ErrorsParams> {
            return null
        }
    }

    class CreateAddressStub implements CreateAddress.ICreateAddress {
        execute(params: CreateAddress.CreateParams): Promise<Addresses> {
            return Promise.resolve({  ...params, id: "address_generic_id", })
        }
    }

    class CreateAnnexStub implements CreateAnnex.ICreateAnnex {
        execute(params: CreateAnnex.Params): Promise<boolean> {
            return Promise.resolve(true)
        }
    }

    class CreateMartStub implements Pick<CreateMart.ICreateMart, 'execute' | 'checkDuplicity'> {
        execute(params: CreateMart.Params): Promise<MartModel> {
            return Promise.resolve(MakeFakeMart({...params, id:'generated_mart_id'}))
        }
        checkDuplicity(cnpj_cpf: string, email: string, phone?: string, corporate_name?: string, financial_email?: string, mart?: MartModel): Promise<void> {
            return Promise.resolve()
        }
    }

    function hooks () {
        console.log("running hooks")
    }

    const addressValidatorStub = new AddressValidatorStub()
    const createAddressStub = new CreateAddressStub()
    const createAnnexStub = new CreateAnnexStub()
    const createMartStub = new CreateMartStub()

    const sut = new SignUpMartController({},{},addressValidatorStub, createAddressStub, createMartStub, createAnnexStub, hooks)

    return { sut, createMartStub, addressValidatorStub, createAddressStub, createAnnexStub, hooks }
}

const makeRequest = (body?:any, files?:any) =>{
    return ({
        body: {
            name: "Mercado do Zé", 
            email: "mercadodoze@mail.com", 
            phone: "13245649", 
            cnpj_cpf:"1618416541652", 
            responsible_name:"Seu ze",
            transfer_allowed:true,
            address: {}, 
            ...body,
        },
        params: {},
        query: {},
        headers: {},
        files: { ...files }
       
    })
}
describe('should test the sigup of marts', () =>{
    

    describe('check Duplicity', () =>{

        test(' Should enter the correct values', async () =>{
            const { sut, createMartStub } = makeSut()
            const spy = jest.spyOn(createMartStub,'checkDuplicity')
            await sut.handler(makeRequest({cnpj_cpf:"123456",email:"meuemail@mail",phone: "9999999"}))
            expect(spy).toHaveBeenCalledWith('123456','meuemail@mail','9999999')
        })
    })

    describe('AddressValidation', () =>{

        test('Receive the correct values', async () =>{
            const { sut, createMartStub, addressValidatorStub } = makeSut()
            const addressJson = JSON.stringify(MakeFakeAddress())
            const CaseSpy = jest.spyOn(addressValidatorStub,'validate')
            const methodSpy = jest.spyOn(sut,'validateAddress')

            await sut.handler(makeRequest({cnpj_cpf:"123456",email:"meuemail@mail",phone: "9999999", address: addressJson}))
            expect(methodSpy).toHaveBeenCalledWith(addressJson)
            expect(CaseSpy).toHaveBeenCalledWith(JSON.parse(addressJson))
        })


        test('Should return badRquest if errors were founded on Adress', async () =>{
            const { sut, createMartStub, addressValidatorStub } = makeSut()

            jest.spyOn(addressValidatorStub,'validate').mockImplementationOnce( ()=>{
                return Promise.resolve({
                    address: "Missing Params on address"
                })
            })
            const addressJson = JSON.stringify(MakeFakeAddress())
            const result = await  sut.handler(makeRequest({cnpj_cpf:"123456",email:"meuemail@mail",phone: "9999999", address: addressJson}))
            expect(result).toEqual({ status: 400, body: InvalidRequestBodyError( { address: {address: "Missing Params on address"}} ) })
        })

        test('Should return serverError if unknow error ', async () =>{
            const { sut, createMartStub, addressValidatorStub } = makeSut()

            jest.spyOn(addressValidatorStub,'validate').mockImplementationOnce( ()=>{
                return Promise.reject(new Error('deu ruim aqui em '))
            })
            const addressJson = JSON.stringify(MakeFakeAddress())
            const result = await  sut.handler(makeRequest({cnpj_cpf:"123456",email:"meuemail@mail",phone: "9999999", address: addressJson}))
            expect(result).toEqual(serverError())
        })

    })

    describe('Creation', () =>{

        test('Should receive correct values', async () =>{
            const { sut, createMartStub, createAddressStub } = makeSut()
            const addressJson = JSON.stringify(MakeFakeAddress())
            const createMartSpy = jest.spyOn(createMartStub,'execute')
            const createAdresssSpy = jest.spyOn(createAddressStub,'execute')

            const request = makeRequest({ address: addressJson})
            await sut.handler(request)
            
            expect(createAdresssSpy).toHaveBeenCalledWith(JSON.parse(addressJson))

            delete request.body.address
            expect(createMartSpy).toHaveBeenCalledWith({
                ...request.body,
                obs: "", 
                password : null,
                image: null,
                financial_email: null, 
                corporate_name: null,
                address_id: "address_generic_id"
            })
        })

        test('Should return data', async () =>{
            const { sut, createMartStub, createAddressStub } = makeSut()
            const addressJson = JSON.stringify(MakeFakeAddress())
            const createMartSpy = jest.spyOn(createMartStub,'execute')
            const createAdresssSpy = jest.spyOn(createAddressStub,'execute')

            const request = makeRequest({ address: addressJson})
            const result  = await sut.handler(request)
            delete request.body.address
            expect(result).toMatchObject(success({
                id: 'generated_mart_id',
                address_id: "address_generic_id",
                ...request.body
            }))
          
        })

    })

    describe('Add Annexs', () =>{
        test("Should Receive Corrent values", async () =>{
            const { sut, createAnnexStub, hooks } = makeSut()
            const addressJson = JSON.stringify(MakeFakeAddress())
            const request = makeRequest({ address: addressJson}, 
                {
                    annexs: [
                       { Buffer: Buffer.alloc(1),
                        contentType: "tipo teste",
                        fileName: "Nome do arquiv"},
                        { Buffer: Buffer.alloc(1),
                            contentType: "tipo teste",
                            fileName: "Nome do arquiv dois"}
                    ]
                })
            const addAnnexSpy = jest.spyOn(sut,'addAnnexs')
            const annexSpy = jest.spyOn(createAnnexStub,'execute')
            await sut.handler(request)

            expect(addAnnexSpy).toHaveBeenCalledWith(request.files.annexs,'generated_mart_id')
            expect(annexSpy).toHaveBeenCalledTimes(2)
            expect(annexSpy).toHaveBeenNthCalledWith(1,{
                buffer:  request.files.annexs[0].buffer,
                contentType:  request.files.annexs[0].contentType,
                mart_id: 'generated_mart_id',
                name: (request.files.annexs[0].fileName).split('.').slice(0, -1).join('.')
            } )
            
        })
    })

    describe('Ok', () =>{
        test("should do fine", async () =>{
            const { sut, createAnnexStub, hooks } = makeSut()
            const addressJson = JSON.stringify(MakeFakeAddress())
            const request = makeRequest({address: addressJson})
            const result = await sut.handler(request)
            delete request.body.address
            expect(result).toBeTruthy()
            expect(result).toMatchObject(success(
                {
                    ...request.body,
                    id: "generated_mart_id",
                    address_id: "address_generic_id",
                    password : null,
                    image: null,
                    financial_email: null, 
                    corporate_name: null,
                }
            ))       
        })
    })
})