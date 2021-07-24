import keys from './config/keys'
import express from "express"
import setMiddlewares from './middlewares'
import setRoutes from './routes'
//parei aqui

async function main(){
    const app = express()
    setMiddlewares(app)
    setRoutes(app)
    app.listen(keys.port, ()=>{ 
        console.log("....................")
        console.log(" Server is running")
        console.log("  - PORT:", keys.port)
        console.log("  - ENV.:", keys.node_env)
        console.log("....................\n")
    })
}
main()