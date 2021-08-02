import { ImageTransformer } from "../../domain/vendors/ImageTransformer"

const sharp = require('sharp')


export default class SharpAdapter implements ImageTransformer {

  resolve(buffer: Buffer, dimensions: ImageTransformer.Dimensions, format: string): ImageTransformer.Result {
    return {   buffer, dimensions, contentType: `image/${format}` } 
  }

  async getInfo(buffer: Buffer) {
    const { data, info } = await sharp(buffer).toBuffer({ resolveWithObject: true })
    return this.resolve(data, { width: info.width, height: info.height }, info.formatnpm 
      )
  }

  async convert(params: ImageTransformer.ConvertParams){
    const { buffer, type } = params
    const { data, info } = await sharp(buffer).toFormat(type).toBuffer({ resolveWithObject: true })
    return this.resolve(data, { width: info.width, height: info.height }, info.format )
  }

  async resize( params: ImageTransformer.ResizeParams) {
      const { buffer, dimensions } = params
    const { data, info } = await sharp(buffer).resize(dimensions).toBuffer({ resolveWithObject: true })
    return this.resolve(data, { width: info.width, height: info.height }, info.format)
  }

  async crop(params: ImageTransformer.CropParams ) {
    const { buffer, viewPort } = params
    var { x, y, w, h } = viewPort
    w = (x + w > 1) ? 1 - x : w
    h = (y + h > 1) ? 1 - y : h

    const {data, info } = await sharp(buffer).metadata().then((i:any) => {
      return sharp(buffer)
      .extract({
        left: Math.floor(x * i.width), top: Math.floor(y * i.height), 
        width: Math.floor(i.width * w), height: Math.floor(i.height * h) })
      .toBuffer({ resolveWithObject: true })
    })
    return this.resolve(data, { width: info.width, height: info.height }, info.format )
  }


}

module.exports = SharpAdapter