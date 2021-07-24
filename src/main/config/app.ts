import keys from './keys'
import setMiddlewares from '../config/middlewares'
import setRoutes from '../routes'
import express from "express"

const app = express()

app.set('keys', keys)
setMiddlewares(app)
setRoutes(app)

export default app