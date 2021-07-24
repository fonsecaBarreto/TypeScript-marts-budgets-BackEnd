"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = void 0;
const marts_1 = require("../marts");
const http_helper_1 = require("../../../presentation/helpers/http-helper");
const Errors_1 = require("../../../domain/protocols/Errors");
const KnexAdapter_1 = __importDefault(require("../../../libs/KnexAdapter"));
const bcryptjs_1 = require("bcryptjs");
const Schemas_json_1 = require("../../../presentation/controllers/marts-controllers/Schemas.json");
const makeRequest = (fields) => ({
    headers: {},
    params: {},
    query: {},
    body: {},
    ...fields
});
exports.makeRequest = makeRequest;
describe("Mart Login", () => {
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
        /*  authMartController, martSignInController */
        test('400 on Missing Params', async () => {
            const result = await marts_1.martSignInController.run(exports.makeRequest());
            expect(result).toEqual(http_helper_1.badRequest(Errors_1.InvalidRequestBodyError({})));
            expect(result.body.params).toEqual({
                credentials: Schemas_json_1.SignIn.credentials.missingMessage,
                password: Schemas_json_1.SignIn.password.missingMessage,
            });
        });
        test('400 on Invalid Params', async () => {
            const result = await marts_1.martSignInController.run(exports.makeRequest({ body: { credentials: 123 } }));
            expect(result).toEqual(http_helper_1.badRequest(Errors_1.InvalidRequestBodyError({})));
            expect(result.body.params).toEqual({
                credentials: Schemas_json_1.SignIn.credentials.invalidMessage,
                password: Schemas_json_1.SignIn.password.missingMessage,
            });
        });
        test('403, MartNotFOund on unknow admin', async () => {
            const result = await marts_1.martSignInController.run(exports.makeRequest({ body: { credentials: "unknow_admin", password: "123456" } }));
            expect(result).toEqual(http_helper_1.forbidden(Errors_1.MartNotFoundError()));
        });
        test('401 on wrong admin password', async () => {
            const compareSpy = jest.spyOn(marts_1.martSignInController.hasher, 'compare');
            const result = await marts_1.martSignInController.run(exports.makeRequest({ body: { credentials: "123456465", password: "wrong_password" } }));
            expect(compareSpy).toHaveBeenCalledTimes(1); //garantes it wasnt unauthorized by the repository
            expect(result).toEqual(http_helper_1.unauthorized());
        });
        test('200 should receive a succes token', async () => {
            const result = await marts_1.martSignInController.run(exports.makeRequest({ body: { credentials: "comercio_test@mail.com", password: "123456" } }));
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('accessToken');
        });
    });
});
