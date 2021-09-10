import keys from './config/keys'
import { AdminModel } from '../domain/entities/AdminModel'
import { MartModel } from '../domain/entities/MartModel'
import KnexAdapter from '../libs/KnexAdapter'
require('dns').lookup(require('os').hostname(), function (err:any, add:any, fam:any) {
    console.log('err: ' + err);
    console.log('addr: ' + add);
    console.log('fam: ' + fam);
})


declare global {
    namespace Express {
        interface Request {
            files: any ,
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
        console.log("  - TEST.:", keys)
        console.log("....................\n")
        console.log(KnexAdapter.connection)
    })
}
main()