
import { Router } from 'express'
import { DownloadXlsController } from '../../presentation/controllers/Downloadxls'
import { ProviderFromExecel } from '../../data/CaptureDataFromExcel/providers'
import { MartsFromExcel } from '../../data/CaptureDataFromExcel/marts'
import { ProductsFromExcel } from '../../data/CaptureDataFromExcel/products'
import { OrdersFromExcel } from '../../data/CaptureDataFromExcel/orders'
import { repositories } from '../factories/depedencies'

import KnexAdapter from '../../libs/KnexAdapter'

/* providers */
const providerFromExecel = new ProviderFromExecel(repositories.providersRepository) //caso de uso
const prividerFormExecelController = new DownloadXlsController(providerFromExecel,'fornecedores')
/* marts */
const martsFromExcel = new MartsFromExcel(repositories.martsRepository) //caso de uso
const martsFromExcelController = new DownloadXlsController(martsFromExcel,'Estabelecimentos')
/* products */
const productsFromExcel = new ProductsFromExcel(repositories.productsRepository,KnexAdapter.connection ) //caso de uso
const productsFromExcelController = new DownloadXlsController(productsFromExcel,'Items')
/* orders */
const ordersFromExcel = new OrdersFromExcel(repositories.ordersRepository,KnexAdapter.connection ) //caso de uso
const orderFronExcelController = new DownloadXlsController(ordersFromExcel,'Ordens')

export default (router: Router ) =>{
    router.get("/data/download/excel/providers", prividerFormExecelController.execute())
    router.get("/data/download/excel/marts", martsFromExcelController.execute())
    router.get("/data/download/excel/products", productsFromExcelController.execute())
    router.get("/data/download/excel/orders", orderFronExcelController.execute())
}