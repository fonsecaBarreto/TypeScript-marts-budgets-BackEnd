import keys from '../config/keys'
import KnexAdapter from '../../libs/KnexAdapter'
import { MainController } from '../../presentation/helpers/MainController'
import { repositories } from './dependencies'
import { vendors } from './depedencies'

KnexAdapter.open(keys.node_env)
MainController.encrypter = vendors.encrypter
MainController.martRepository = repositories.martsRepository
MainController.adminRepository = repositories.adminsRepository

