import { vendors, repositories } from '../dependencies/index'
import { CreateRating } from '../../../data/mart/rating/CreateRating'
import { FindRatingController, MakeRatingontroller } from '../../../presentation/controllers/marts-controllers/rating'
import ratingSchema from "./schemas/rating-Schema.json"
import { MakeRatingPrivateView } from '../../../presentation/controllers/marts-controllers/rating/serializers/RatingPrivateView'

const { idGenerator } = vendors
const { ratingRepository, martsRepository } = repositories


/* serializers */

export const serializers = {
    ratingPrivateView: MakeRatingPrivateView(martsRepository)
}
/* usecases */
export const usecases = {
    createRating: new CreateRating(idGenerator, ratingRepository),
}

/* controllers */
export const controllers = {
    rate: new MakeRatingontroller( ratingSchema, usecases.createRating ),
    list: new FindRatingController(ratingRepository, serializers.ratingPrivateView)
} 