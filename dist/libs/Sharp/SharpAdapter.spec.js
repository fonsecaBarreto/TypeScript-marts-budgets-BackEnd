"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SharpAdapter_1 = __importDefault(require("./SharpAdapter"));
const fs_1 = __importDefault(require("fs"));
const chimpBuffer = fs_1.default.readFileSync(__dirname + "/test-assets/chimp.jpg");
const makeSut = () => {
    return new SharpAdapter_1.default();
};
describe("Should convert ", () => {
    test("should Convert", async () => {
        const sut = makeSut();
        const result = await sut.convert({ buffer: chimpBuffer, type: "webp" });
        expect(result).toBeTruthy();
        expect(result).toHaveProperty('buffer');
        expect(result.dimensions).toEqual({ width: 640, height: 640 });
        expect(result.contentType).toBe('image/webp');
    });
    test("should Convert", async () => {
        const sut = makeSut();
        const result = await sut.resize({ buffer: chimpBuffer, dimensions: { width: 300, height: 300 } });
        expect(result).toBeTruthy();
        expect(result).toHaveProperty('buffer');
        expect(result.dimensions).toEqual({ width: 300, height: 300 });
        expect(result.contentType).toBe('image/jpeg');
    });
    test("should Crop", async () => {
        const sut = makeSut();
        const result = await sut.crop({ buffer: chimpBuffer, viewPort: { x: 0, y: 0.5, w: 0.5, h: 0.5 } });
        expect(result).toBeTruthy();
        expect(result).toHaveProperty('buffer');
        expect(result.dimensions).toEqual({ width: 320, height: 320 });
        expect(result.contentType).toBe('image/jpeg');
    });
});
