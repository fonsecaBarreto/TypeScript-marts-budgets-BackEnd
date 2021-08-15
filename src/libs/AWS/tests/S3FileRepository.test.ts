import {config} from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

import S3FileRepository from '../S3FileRepository'
const monkeyBuffer = fs.readFileSync(__dirname+"/monkeydoes.jpg")

const makeSut = () => {
  const sut =  new S3FileRepository(process.env.AWS_UPLOADS_BUCKET, process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY, process.env.AWS_REGION )
  return sut
}

describe("Should upload file using aws s3", () => {
  const data = "test"

  test('Should Throw error if buffer was not provided', async () =>{
    const sut = makeSut()
    const promise =  sut.save({
      buffer: null,
      contentType: "image/jpeg",
      name: `${data}/name_test.jpg`
    })

    await expect(promise).rejects.toThrow()
  })

  test('Should upload file', async () =>{
    const sut = makeSut()
    const result = await  sut.save({
      buffer: monkeyBuffer,
      contentType: "image/jpeg",
      name: `${data}/name_test.jpg`
    })
    expect(result).toEqual({
      name: `${data}/name_test.jpg`
    })
  })

  test('Should get file', async () =>{
    const sut = makeSut()
    const result = await sut.get( "test/name_test.jpg")
    console.log(result)
    expect(result).toHaveProperty("size")
    expect(result).toHaveProperty("contentType")
    expect(result).toHaveProperty("stream")
  }) 

  test('Should remove file', async () =>{
    const sut = makeSut()
    await sut.remove(`${data}/name_test.jpg`)
  }) 



  /* describe("Download", () => {
    test('Should get full Object ', async () =>{
      const sut = makeSut()
      const result = await sut.download({ name: "test/name_test.jpg" })
      expect(result).toHaveProperty('size')
      expect(result).toHaveProperty('contentType')
      expect(result).toHaveProperty('body')
      expect(result.body).toBeTruthy()
    })
  }) 
  describe("Stream", () => {
    test('Should stream object ', async () =>{
      const sut = makeSut()
      const result = await sut.stream({ name: "test/name_test.jpg" })
      expect(result).toHaveProperty('size')
      expect(result).toHaveProperty('contentType')
      expect(result).toHaveProperty('body')
      expect(result.body).toBeTruthy()
    })
  }) 
  describe("Get data", () => {
    test('Should get object data', async () =>{
      const sut = makeSut()
      const result = await sut.getMetaData({ name: "test/name_test.jpg" })
      expect(result).toHaveProperty('size')
      expect(result).toHaveProperty('contentType')
      expect(result).toHaveProperty('body')
      expect(result.body).toBeFalsy()
    })
  })  */

})