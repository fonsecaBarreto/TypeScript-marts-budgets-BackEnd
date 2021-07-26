"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamControler = void 0;
function StreamControler(authenticator, fileRepository) {
    return async (req, res) => {
        try {
            var response = await authenticator.execute(req);
            if (response) {
                return res.status(response.status).json({ error: {
                        name: response.body.name, message: response.body.message, params: response.body.params,
                    } });
            }
            const { query, user } = req;
            const name = query.v;
            if (!name)
                return res.status(404).end("Not Found");
            const { size, contentType, stream } = await fileRepository.get(name + '');
            const head = { 'Content-Length': size, 'Content-Type': contentType };
            res.writeHead(206, head);
            stream.pipe(res);
        }
        catch (err) {
            console.log(err);
            return res.status(404).end("Not Found");
        }
    };
}
exports.StreamControler = StreamControler;
