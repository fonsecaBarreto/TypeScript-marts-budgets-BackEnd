import LocalFileStorage from '../LocalFileStorage'
import path from 'path'
import fs from 'fs'

const imageBuffer = fs.readFileSync(path.join(__dirname, '/test.jpeg'))

const sut = new LocalFileStorage(path.join(__dirname, "/uploads"))

describe("LocalSTorage", () =>{
    beforeAll(  ()=> { fs.rmSync(path.join(__dirname, "uploads"),{recursive: true, force:true  })  })
    test('Shoudl store some file', async () =>{
        await sut.save({buffer: imageBuffer,contentType:"image/jpeg",name: "Nome da Imagme aqui"})
        const exists = fs.existsSync(path.join(__dirname, "/uploads","Nome da Imagme aqui.jpeg"))
        expect(exists).toBe(true)
    })
    test('Should ge image stream', async () =>{
        const stream = await sut.get("Nome da Imagme aqui.jpeg")
        expect(stream).toBeTruthy()
    })

    test('Should delete ', async () =>{

        const name = path.join(__dirname, "/uploads","test_image.jpeg")

        fs.writeFileSync(name, imageBuffer)


        var exists = fs.existsSync(name)
        expect(exists).toBe(true)
        await sut.remove("test_image.jpeg")

        exists = fs.existsSync(name)
        expect(exists).toBe(false)

    })

})