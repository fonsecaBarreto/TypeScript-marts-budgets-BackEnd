"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = void 0;
const keys_1 = __importDefault(require("../../config/keys"));
const admins_1 = require("../admins");
const http_helper_1 = require("../../../presentation/helpers/http-helper");
const Errors_1 = require("../../../domain/protocols/Errors");
const KnexAdapter_1 = __importDefault(require("../../../libs/KnexAdapter"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const makeRequest = (fields) => ({
    headers: {},
    params: {},
    query: {},
    body: {},
    ...fields
});
exports.makeRequest = makeRequest;
describe("Admin Login", () => {
    beforeAll(async () => {
        await KnexAdapter_1.default.resetMigrations();
        await KnexAdapter_1.default.connection('admins').insert({
            id: "admin_test_id",
            username: "admin_test",
            password: bcryptjs_1.hashSync("123456")
        });
        await KnexAdapter_1.default.connection('marts').insert({
            id: "mart_test_id",
            name: "comercio_test",
            email: "comercio_test@mail.com",
            phone: "123456789",
            cnpj_cpf: "123456465",
            password: bcryptjs_1.hashSync("123456")
        });
    });
    afterAll(async () => {
        await KnexAdapter_1.default.close();
    });
    describe("Signin", () => {
        test('400 on Missing Params', async () => {
            const result = await admins_1.adminSignInController.run(exports.makeRequest());
            expect(result).toEqual(http_helper_1.badRequest(Errors_1.InvalidRequestBodyError({})));
            expect(result.body.params).toEqual({
                username: "Campo de Nome de Usuario é obrigatorio",
                password: "Campo de Senha é obrigatorio"
            });
        });
        test('400 on Invalid Params', async () => {
            const result = await admins_1.adminSignInController.run(exports.makeRequest({ body: { username: "Errado" } }));
            expect(result).toEqual(http_helper_1.badRequest(Errors_1.InvalidRequestBodyError({})));
            expect(result.body.params).toEqual({
                password: "Campo de Senha é obrigatorio"
            });
        });
        test('401 on unknow admin', async () => {
            const result = await admins_1.adminSignInController.run(exports.makeRequest({ body: { username: "unknow_admin", password: "123456" } }));
            expect(result).toEqual(http_helper_1.unauthorized());
        });
        test('401 on wrong admin password', async () => {
            const compareSpy = jest.spyOn(admins_1.adminSignInController.hasher, 'compare');
            const result = await admins_1.adminSignInController.run(exports.makeRequest({ body: { username: "admin_test", password: "wrong_password" } }));
            expect(compareSpy).toHaveBeenCalledTimes(1); //garantes it wasnt unauthorized by the repository
            expect(result).toEqual(http_helper_1.unauthorized());
        });
        test('200 should receive a succes token', async () => {
            const result = await admins_1.adminSignInController.run(exports.makeRequest({ body: { username: "admin_test", password: "123456" } }));
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('accessToken');
        });
    });
    describe("auth", () => {
        test('401 on Missing Authorization Header', async () => {
            const result = await admins_1.authAdminController.run(exports.makeRequest());
            expect(result).toEqual(http_helper_1.unauthorized());
        });
        test('401 on Inalid Authorization Token', async () => {
            const result = await admins_1.authAdminController.run(exports.makeRequest({
                headers: { authorization: "asdasd" }
            }));
            expect(result).toEqual(http_helper_1.unauthorized());
        });
        test('401 on Inalid Authorization Token', async () => {
            const token = await jsonwebtoken_1.sign({ id: "mart_test_id" }, keys_1.default.jwt_secret);
            const result = await admins_1.authAdminController.run(exports.makeRequest({
                headers: { authorization: `Bearer ${token}` }
            }));
            expect(result).toEqual(http_helper_1.unauthorized());
        });
        test('200 on valid token', async () => {
            const token = await jsonwebtoken_1.sign({ id: "admin_test_id" }, keys_1.default.jwt_secret);
            const result = await admins_1.authAdminController.run(exports.makeRequest({
                headers: { authorization: `Bearer ${token}` }
            }));
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({
                id: "admin_test_id",
                username: "admin_test"
            }));
        });
    });
});
