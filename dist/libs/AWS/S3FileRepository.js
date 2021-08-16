"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class S3FileRepository {
    constructor(bucket, accessKeyId, secretAccessKey, region) {
        this.bucket = bucket;
        aws_sdk_1.default.config.update({ accessKeyId, secretAccessKey, region });
        this.s3Adapter = new aws_sdk_1.default.S3();
    }
    async save(params) {
        const { buffer, contentType, name } = params;
        try {
            const result = await this.s3Adapter.upload({ Bucket: this.bucket, Body: buffer, ContentType: contentType, Key: name, ACL: "private" }).promise();
            return { name: result.Key };
        }
        catch (err) {
            throw err;
        }
    }
    async remove(name) {
        const params = { Bucket: this.bucket, Key: name };
        try {
            await this.s3Adapter.deleteObject(params).promise();
        }
        catch (err) {
            throw err;
        }
    }
    async get(name) {
        const { ContentLength, ContentType } = await this.s3Adapter.headObject({ Bucket: this.bucket, Key: name }).promise();
        const stream = this.s3Adapter.getObject({ Bucket: this.bucket, Key: name }).createReadStream();
        return {
            stream,
            size: Number(ContentLength),
            contentType: ContentType + ''
        };
    }
}
exports.default = S3FileRepository;
