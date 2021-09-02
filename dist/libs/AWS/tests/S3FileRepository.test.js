"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
dotenv_1.config();
const S3FileRepository_1 = __importDefault(require("../S3FileRepository"));
const monkeyBuffer = fs_1.default.readFileSync(__dirname + "/monkeydoes.jpg");
const makeSut = () => {
    const sut = new S3FileRepository_1.default(process.env.AWS_UPLOADS_BUCKET, process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY, process.env.AWS_REGION);
    return sut;
};
describe("Should upload file using aws s3", () => {
    const data = "test";
    test('Should Throw error if buffer was not provided', async () => {
        const sut = makeSut();
        const promise = sut.save({
            buffer: null,
            contentType: "image/jpeg",
            name: `${data}/name_test.jpg`
        });
        await expect(promise).rejects.toThrow();
    });
    test('Should upload file', async () => {
        const sut = makeSut();
        const result = await sut.save({
            buffer: monkeyBuffer,
            contentType: "image/jpeg",
            name: `${data}/name_test.jpg`
        });
        expect(result).toEqual({
            name: `${data}/name_test.jpg`
        });
    });
    test('Should get file', async () => {
        const sut = makeSut();
        const result = await sut.get("test/name_test.jpg");
        console.log(result);
        expect(result).toHaveProperty("size");
        expect(result).toHaveProperty("contentType");
        expect(result).toHaveProperty("stream");
    });
    test('Should remove file', async () => {
        const sut = makeSut();
        await sut.remove(`${data}/name_test.jpg`);
    });
});
