"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalFileStorage_1 = __importDefault(require("../LocalFileStorage"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const imageBuffer = fs_1.default.readFileSync(path_1.default.join(__dirname, '/test.jpeg'));
const sut = new LocalFileStorage_1.default(path_1.default.join(__dirname, "/uploads"));
describe("LocalSTorage", () => {
    beforeAll(() => { fs_1.default.rmSync(path_1.default.join(__dirname, "uploads"), { recursive: true, force: true }); });
    test('Shoudl store some file', async () => {
        await sut.save({ buffer: imageBuffer, contentType: "image/jpeg", name: "Nome da Imagme aqui" });
        const exists = fs_1.default.existsSync(path_1.default.join(__dirname, "/uploads", "Nome da Imagme aqui.jpeg"));
        expect(exists).toBe(true);
    });
    test('Should ge image stream', async () => {
        const stream = await sut.get("Nome da Imagme aqui.jpeg");
        expect(stream).toBeTruthy();
    });
    test('Should delete ', async () => {
        const name = path_1.default.join(__dirname, "/uploads", "test_image.jpeg");
        fs_1.default.writeFileSync(name, imageBuffer);
        var exists = fs_1.default.existsSync(name);
        expect(exists).toBe(true);
        await sut.remove("test_image.jpeg");
        exists = fs_1.default.existsSync(name);
        expect(exists).toBe(false);
    });
});
