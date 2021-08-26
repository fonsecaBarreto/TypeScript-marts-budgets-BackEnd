import { CreateCheckList, UpdateCheckList } from '../../../data/mart/checklist'
import { martsChecklistsRepository, martsRepository } from './dependencies'

export const createCheckList = new CreateCheckList(martsChecklistsRepository)
export const updateCheckList = new UpdateCheckList(martsChecklistsRepository)