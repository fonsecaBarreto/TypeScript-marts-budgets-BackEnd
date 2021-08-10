import { vendors, repositories } from './depedencies'
import CreateAnnex from '../../data/annex/CreateAnnex'


const { idGenerator, fileRepository } = vendors
const { martannexsRepository  } = repositories

/* usecases */
export const createAnnex = new CreateAnnex(idGenerator, fileRepository, martannexsRepository)


