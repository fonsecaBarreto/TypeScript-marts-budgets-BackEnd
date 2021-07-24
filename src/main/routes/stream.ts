import { Router } from "express"
import { fileRepository } from '../factories/depedencies'
import { StreamControler } from '../../presentation/controllers/StreamController'

const streamController =new StreamControler(fileRepository)
export default ( router: Router) =>{

    router.get('/stream',streamController.execute())
    
}