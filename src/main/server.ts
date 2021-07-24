import keys from './config/keys'
import { AdminModel } from '../domain/entities/AdminModel'
import { MartModel } from '../domain/entities/MartModel'

declare global {
    namespace Express {
        interface Request {
            file: any ,
            user: AdminModel | MartModel
        }
    }
}

async function main(){

    const app = (await import('./config/app')).default

    app.listen(keys.port, ()=>{ 
        console.log("....................")
        console.log(" Server is running")
        console.log("  - PORT:", keys.port)
        console.log("  - ENV.:", keys.node_env)
        console.log("....................\n")
    })
}
main()