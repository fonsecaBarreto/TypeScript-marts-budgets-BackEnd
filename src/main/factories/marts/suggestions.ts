import { vendors, repositories } from '../dependencies/index'
import { CreateSuggestion } from '../../../data/mart/suggestions/CreateSuggestion'

import { MakeSuggestionController } from '../../../presentation/controllers/marts-controllers/suggestions/CreateSuggestion'
import { item as ItemSchema, suggestion as SuggestionSchema} from './schemas/suggestion-Schema.json'
import JsonValidator from '../../../libs/JsonValidator'
import { SchemaRow } from '../../../domain/protocols/ControllerBateries'

const suggestionSchema: Record<string, SchemaRow> = SuggestionSchema
const itemSchema: Record<string, SchemaRow> = ItemSchema

const { idGenerator } = vendors
const { suggestionsRepository } = repositories
export const SuggestionItemValidator = new JsonValidator(itemSchema)

/* usecases */
export const usecases = {
    createsuggestion: new CreateSuggestion(idGenerator, suggestionsRepository),
}

/* controllers */
export const controllers = {
    suggest: new MakeSuggestionController( suggestionSchema, SuggestionItemValidator, usecases.createsuggestion)
} 