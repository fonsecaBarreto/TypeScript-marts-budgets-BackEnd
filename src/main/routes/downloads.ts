
import { Router } from 'express'
import { DownloadXlsController } from '../../presentation/controllers/Downloadxls'
import { ProviderFromExecel } from '../../data/CaptureDataFromExcel/providers'
import { repositories } from '../factories/depedencies'


const providerFromExecel = new ProviderFromExecel(repositories.providersRepository) //caso de uso
const prividerFormExecelController = new DownloadXlsController(providerFromExecel)

export default (router: Router ) =>{
    router.get("/data/download/excel/providers", prividerFormExecelController.execute())
}