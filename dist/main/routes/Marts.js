"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../factories/marts/index");
exports.default = (router) => {
    /* public  */
    router.post("/marts/login/signin", index_1.controllers.login.signin.execute());
    router.post('/marts/login/signup', index_1.controllers.login.signup.execute()); //<---
    /* marts */
    router.post("/marts/login/auth", index_1.controllers.login.auth.execute());
    router.post("/marts/login/reset-password", index_1.controllers.login.resetPassword.execute());
    router.post("/marts/login/change-password", index_1.controllers.login.changePasswordByToken.execute());
    /*  admin */
    router.get('/marts/list', index_1.controllers.filterList.execute());
    router.route('/marts')
        .get(index_1.controllers.crud.find.execute())
        .post(index_1.controllers.crud.create.execute());
    router.route('/marts/:id')
        .get(index_1.controllers.crud.find.execute())
        .delete(index_1.controllers.crud.remove.execute())
        .put(index_1.controllers.crud.update.execute());
    router.route('/marts/:id/join')
        .patch(index_1.controllers.join.execute());
};
