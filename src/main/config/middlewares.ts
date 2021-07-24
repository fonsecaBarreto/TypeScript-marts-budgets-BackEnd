import { json, Express } from 'express'
import cors from 'cors'

export default (app: Express) => {

  app.use((req,res,next) => {
    console.log("\nNova Requisição:")
    console.log("  - ",req.method, req.path)
    next()
  })

  app.use(json())
  app.use(cors())
  
}