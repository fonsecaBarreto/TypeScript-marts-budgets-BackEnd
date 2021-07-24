import keys from '../config/keys'
import { Router, Express } from 'express'
import { readdirSync } from 'fs'

export default (app: Express)  => {

    const router = Router()
    app.use('/api', router) 

    router.get("/status", (req, res)=>{
        return res.json({
            STATUS: "Running",
            PORT: keys.port,
            ENV: keys.node_env
        })
    })

    readdirSync(__dirname).map( async file => {
        const name = file.split('.').slice(0, -1).join('.')
        if(name == "index") return
        (await import(`./${file}`)).default(router)
    })

}
  