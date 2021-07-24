import { Express } from 'express'
import { hashSync } from 'bcryptjs'
import request from 'supertest'
import KnexAdapter from '../../src/libs/KnexAdapter'
import { sign } from 'jsonwebtoken'

var app: Express;
var keys: any ;

var ADMIN_TOKEN: string;
var MART_TOKEN: string ;

describe('Login Routes', () => {

  beforeAll(async ()=>{

    app = (await import('../../src/main/config/app')).default
    keys = app.get('keys')
    ADMIN_TOKEN= await sign({ id: 'admin_test_id' },keys.jwt_secret )
    MART_TOKEN = await sign({ id: 'mart_test_id' }, keys.jwt_secret )

    await KnexAdapter.open('test')
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


  describe('Admin Login /api/admins/login/', () =>{
    describe('POST /api/admins/login/signin', () => {

      test('Should return 400 on missing or Invalid params', async () => {

        await request(app)
          .post('/api/admins/login/signin')
          .send({})
          .expect(400)

        await request(app)
          .post('/api/admins/login/signin')
          .send({ username: 123, password: "123456"})
          .expect(400)
      })

      test('Should return 401 on admin not found', async () => {
        await request(app)
          .post('/api/admins/login/signin')
          .send({ username: 'Invalid_Admin', password: "123456"})
          .expect(401)
      })

      test('Should return 401 on wrong password', async () => {
        await request(app)
          .post('/api/admins/login/signin')
          .send({ username: 'admin_test', password: "wrong_password"})
          .expect(401)
      })

      test('Should return 200 on success', async () => {
        await request(app)
        .post('/api/admins/login/signin')
        .send({ username: 'admin_test', password: "123456"})
        .expect(200)
      })

    })
    describe('POST /api/admins/login/auth', () => {

      test('Should return 401 on missing or invalid token', async () => {

        await request(app)
          .post('/api/admins/login/auth')
          .send().expect(401)

        await request(app)
          .post('/api/admins/login/auth')
          .set({ "authorization": `invaldias`} )
          .send().expect(401)

        await request(app)
          .post('/api/admins/login/auth')
          .set({ "authorization": `Bearer ${MART_TOKEN}`} )
          .send()
          .expect(401)
      })

      test('Should return 200', async () => {
        await request(app)
          .post('/api/admins/login/auth')
          .set({ "authorization": `Bearer ${ADMIN_TOKEN}`} )
          .send().expect(200)
      })
    })

  })
  describe('Mart Login /api/marts/login/', () =>{
    describe('POST /api/marts/login/signin', () => {

      test('Should return 400 on missing or Invalid params', async () => {

        await request(app)
          .post('/api/marts/login/signin')
          .send({})
          .expect(400)

        await request(app)
          .post('/api/marts/login/signin')
          .send({ credentials: 123, password: "123456"})
          .expect(400)
      })

      test('Should return 403 on mart not found', async () => {
        await request(app)
          .post('/api/marts/login/signin')
          .send({ credentials: 'Invalid_Admin', password: "123456"})
          .expect(403)
      })

      test('Should return 401 on wrong password', async () => {
        await request(app)
          .post('/api/marts/login/signin')
          .send({ credentials: '123456789', password: "wrong_password"})
          .expect(401)
      })

      test('Should return 200 on success', async () => {
        await request(app)
        .post('/api/marts/login/signin')
        .send({ credentials: '123456465', password: "123456"})
        .expect(200)
      })

    })
    describe('POST /api/marts/login/auth', () => {

      test('Should return 401 on missing or invalid token', async () => {

        await request(app)
          .post('/api/marts/login/auth')
          .send().expect(401)

        await request(app)
          .post('/api/marts/login/auth')
          .set({ "authorization": `invaldias`} )
          .send().expect(401)

        await request(app)
          .post('/api/marts/login/auth')
          .set({ "authorization": `Bearer ${ADMIN_TOKEN}`} )
          .send()
          .expect(401)
      })

      test('Should return 200', async () => {
        await request(app)
          .post('/api/marts/login/auth')
          .set({ "authorization": `Bearer ${MART_TOKEN}`} )
          .send().expect(200)
      })
    })

  })
})
