import { Router } from 'express'
import { controllers } from '../factories/address'


const { updateAddressController } = controllers


export default (router: Router) =>{

    router.put("/addresses/:id", updateAddressController.execute()) 

}