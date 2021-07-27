import { Router } from 'express'
import { authMartController, martSignInController, 
    createMartController, updateMartController,
    findMartController, removeMartController, signUpMartController,
    joinMartController,
    resetPassword, changePasswordByToken } from '../factories/marts'



export default (router: Router) =>{

    /* public  */
    router.post("/marts/login/signin", martSignInController.execute() )
    router.post('/marts/login/signup', signUpMartController.execute())

    /* marts */
    router.post("/marts/login/auth",authMartController.execute() )
    router.post("/marts/login/reset-password",resetPassword.execute())
    router.post("/marts/login/change-password",changePasswordByToken.execute())

    /*  admin */
    router.route('/marts')
        .get(findMartController.execute())
        .post(createMartController.execute())

    router.route('/marts/:id')
        .get(findMartController.execute())
        .delete(removeMartController.execute())
        .put(updateMartController.execute())

    router.route('/marts/:id/join')
        .patch(joinMartController.execute())

    
}