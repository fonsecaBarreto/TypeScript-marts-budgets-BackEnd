import { FileRepository } from '../../domain/vendors/FileRepository'
import { S3 } from 'aws-sdk'
import AWS from "aws-sdk"

export default class S3FileRepository  implements FileRepository{
  private readonly s3Adapter: S3
  constructor( 
    private readonly bucket: string,
    accessKeyId: string,
    secretAccessKey: string,
    region: string){
      AWS.config.update({ accessKeyId, secretAccessKey,region}); 
      this.s3Adapter = new AWS.S3()
    }

  async save(params: FileRepository.saveParams): Promise<FileRepository.Result> {
    const { buffer, contentType, name } = params
    try{
      const result = await this.s3Adapter.upload({ Bucket: this.bucket, Body: buffer, ContentType: contentType, Key: name, ACL:"private" }).promise()
      return { name: result.Key }
    }catch(err){
      throw err
    }
  }

  async remove(name: string): Promise<void> {

    const params = { Bucket : this.bucket, Key : name }

    try{
      await this.s3Adapter.deleteObject(params).promise();
    }catch(err){
      throw err
    }

  }

  async get(name: string): Promise<FileRepository.GetResult> {
    const { ContentLength, ContentType } = await this.s3Adapter.headObject({ Bucket: this.bucket, Key: name }).promise()
    const stream = this.s3Adapter.getObject({ Bucket: this.bucket,  Key: name }).createReadStream();
    return  { 
      stream,
      size: Number(ContentLength), 
      contentType: ContentType+'' }
  }


} 

