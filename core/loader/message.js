
export class Message {
    uri;
    path;
    id;


    static async Create({ uri, path, id }) {
        if (typeof uri === "object") uri = uri.href;

        try {
            const module = await import(`${uri}messages/${path}.msg.js`).then(m => m.default);

            const msg = new Message({id, ...module});

            msg.uri = uri;
            msg.path = path;

            return msg;
        }
        catch (e) {
            console.log(`Ошибка сборки сообщения ${path}: `, e);
        }
    }


    constructor({ id, send }) {
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }
    }
}
