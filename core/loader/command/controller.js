

export class Controller {
    models = [];
    _locals = [];
    _globals = [];

    GetModel(code) {
        const glob_candidate = this._globals.find(el => el.GetGlobalCode() === code);
        if (glob_candidate) return glob_candidate;
        const local_candidate = this._locals.find(el => el.GetLocalCode() === code);
        if (local_candidate) return local_candidate;

        return false;
    }

    static async Create({ path, global_models, local_models }) {
        const controller_module = await import(path + `.ctr.js`)
        .catch(e => {
            throw Err.ControllerImport({ location: path });
        });

        return new Controller({ ...controller_module.default, _globals: global_models, _locals: local_models });
    }

    constructor ({ models }) {
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }
    }
}