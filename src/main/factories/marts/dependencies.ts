
import KnexAdapter from '../../../libs/KnexAdapter'

export const martsRepository = new KnexAdapter('marts')
export const martsChecklistsRepository = new KnexAdapter('marts_checklists')

