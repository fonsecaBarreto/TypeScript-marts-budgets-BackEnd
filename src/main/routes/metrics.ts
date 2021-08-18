import { Router } from "express"
import { MetricsController } from '../../presentation/controllers/Metrics'
import KnexAdapter from '../../libs/KnexAdapter'

const streamController = new MetricsController(KnexAdapter.connection)

export default ( router: Router) =>{

    router.get('/metrics',streamController.execute())
    
}