export namespace ImageTransformer {
    export type Dimensions = {
        width: number,
        height: number
    }

    export type ViewPort = {  x: number, y: number, w: number, h: number }

    export type ConvertParams = {
        buffer: Buffer,
        type: string
    }
    
    export type ResizeParams = {
        buffer: Buffer,
        dimensions: Dimensions
    }
    
    export type CropParams = {
        buffer: Buffer,
        viewPort: ViewPort
    }
    
    export type Result = {
        buffer: Buffer,
        dimensions: Dimensions,
        contentType: string
    }
}


export interface ImageTransformer {

    getInfo(buffer: Buffer): Promise<ImageTransformer.Result> 

    convert(params: ImageTransformer.ConvertParams): Promise<ImageTransformer.Result> 

    resize( params: ImageTransformer.ResizeParams): Promise<ImageTransformer.Result> 

    crop(params: ImageTransformer.CropParams ): Promise<ImageTransformer.Result> 
}