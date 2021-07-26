import { Express, json, urlencoded } from 'express'
/* import { json, urlencoded } from 'body-parser' */
import cors from 'cors'

export default (app: Express) => {

  app.use((req,res,next) => {
    console.log("\nNova Requisição:")
    console.log("  - ",req.method, req.path)
    next()
  })
  
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true }))
}