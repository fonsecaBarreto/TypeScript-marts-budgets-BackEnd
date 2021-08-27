import { Router } from 'express'
import { controllers } from '../factories/marts/index'

export default (router: Router) =>{

    /* public  */
    router.post("/marts/login/signin", controllers.login.signin.execute() )

    router.post('/marts/login/signup', controllers.login.signup.execute()) //<---

    /* marts */
    router.post("/marts/login/auth",controllers.login.auth.execute() )
    router.post("/marts/login/reset-password",controllers.login.resetPassword.execute())
    router.post("/marts/login/change-password",controllers.login.changePasswordByToken.execute())

    /*  admin */
    router.get('/marts/list', controllers.filterList.execute())

    router.route('/marts')
        .get(controllers.crud.find.execute())
        .post(controllers.crud.create.execute())

    router.route('/marts/:id')
        .get(controllers.crud.find.execute())
        .delete(controllers.crud.remove.execute())
        .put(controllers.crud.update.execute())

    router.route('/marts/:id/join')
        .patch(controllers.join.execute())

    
}