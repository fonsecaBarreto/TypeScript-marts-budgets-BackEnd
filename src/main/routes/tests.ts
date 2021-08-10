import { Router } from "express"
import { TestController } from '../../presentation/controllers/TestController'


const testController = new TestController()
export default (router: Router ) =>{
    router.post('/test',testController.execute())
}