"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marts_1 = require("../factories/marts");
exports.default = (router) => {
    /* public  */
    router.post("/marts/login/signin", marts_1.martSignInController.execute());
    router.post('/marts/login/signup', marts_1.signUpMartController.execute());
    /* marts */
    router.post("/marts/login/auth", marts_1.authMartController.execute());
    router.patch('/marts/:id/annex', marts_1.uploadMartAnnexController.execute());
    /*  admin */
    router.route('/marts')
        .get(marts_1.findMartController.execute())
        .post(marts_1.createMartController.execute());
    router.route('/marts/:id')
        .get(marts_1.findMartController.execute())
        .delete(marts_1.removeMartController.execute())
        .put(marts_1.updateMartController.execute());
    router.route('/marts/:id/join')
        .patch(marts_1.joinMartController.execute());
};
