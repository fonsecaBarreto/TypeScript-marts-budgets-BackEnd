import { vendors, repositories } from '../dependencies/index'
import CreateAnnex from '../../../data/annex/CreateAnnex'

const { idGenerator, fileRepository } = vendors
const { martannexsRepository  } = repositories

/* usecases */

export const usecases = {
    createAnnex: new CreateAnnex(idGenerator, fileRepository, martannexsRepository)
}