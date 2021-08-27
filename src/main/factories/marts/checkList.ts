import { CreateCheckList, UpdateCheckList } from '../../../data/mart/checklist'
import { repositories, vendors } from '../dependencies/index'

export const usecases = {
    createCheckList: new CreateCheckList(repositories.martsChecklistsRepository),
    updateCheckList: new UpdateCheckList(repositories.martsChecklistsRepository)
}