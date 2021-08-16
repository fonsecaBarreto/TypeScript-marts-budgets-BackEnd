"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.ExpressController = void 0;
const Errors_1 = require("./Errors");
class ExpressController {
    constructor(params) {
        const { bodyValidator, contentTypeHandler, userAuthentication } = params;
        this.contentTypeHandler = contentTypeHandler;
        this.userAuthentication = userAuthentication;
        this.bodyValidator = bodyValidator;
    }
    execute() {
        return async (req, res) => {
            try {
                if (this.userAuthentication) {
                    let provResponse = await this.userAuthentication.execute(req);
                    if (provResponse)
                        return sendResponse(res, provResponse);
                }
                if (this.contentTypeHandler) {
                    let provResponse = await this.contentTypeHandler.execute(req, res);
                    if (provResponse)
                        return sendResponse(res, provResponse);
                }
                if (this.bodyValidator) {
                    const errors = await this.bodyValidator.validate(req.body);
                    if (errors)
                        return sendResponse(res, { status: 400, body: Errors_1.InvalidRequestBodyError(errors) });
                }
                var request = {
                    headers: req.headers,
                    body: req.body || {},
                    params: req.params,
                    query: req.query,
                    files: req.files,
                    user: req.user
                };
                const response = await this.handler(request);
                sendResponse(res, response);
            }
            catch (err) {
                if ((err === null || err === void 0 ? void 0 : err.code) == "ApplicationError") {
                    return sendResponse(res, { status: 403, body: err });
                }
                console.log(console.log("\n *Error: ", err.stack));
                return sendResponse(res, { status: 500, body: Errors_1.ServerError() });
            }
        };
    }
}
exports.ExpressController = ExpressController;
function sendResponse(res, response) {
    if (response.status >= 400) {
        console.log("  --> Error: ", response.body.name);
        return res.status(response.status).json({ error: {
                name: response.body.name,
                message: response.body.message,
                params: response.body.params,
            } });
    }
    else {
        if (response.stream) {
            res.set(response.headers);
            res.status(response.status);
            return response.stream.pipe(res);
        }
        return res.status(response.status).json(response.body);
    }
}
exports.sendResponse = sendResponse;
