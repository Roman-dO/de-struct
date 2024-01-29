export class Model {
    addon_id = '';
    id = '';
    module = {};
    load = () => {};

    static GlobalsReadyArray = [];
    static Globals = [];

    static async LoadGlobals() {
        for (let key in this.Globals) {
            let el = this.Globals[key];
            el.load();
        }
    }

    static Get(addon, code) {
        if (code.indexOf(':') === -1) {
            return addon.models.find(el => el.GetLocalCode() === code);
        }
        else {
            return Model.Globals.find(el => el.GetGlobalCode() === code);
        }
    }

    static _create({ model_id, addon_id, module, _global }) {
        try {
            const model = new Model({
                id: model_id,
                addon_id: addon_id,
                ...module,

                _global: _global,
            });
            if (model.load) model.load();
            return model
        } catch (e) {
            // throw new Error(`Ошибка во время сборки модели с id: ${Model.GetGlobalCodeWith(addon_id, model_id)}`);
        }
    }


    static async Create({ model_id, addon_id, module, _global }) {
        try {
            const create_task = this._create({ model_id, addon_id, module, _global });
            if (_global)
                this.GlobalsReadyArray.push(create_task);
            return create_task;
        }
        catch (e) {
            console.log('aaa: ', e);
        }
    }

    _cached_global_code = null;
    GetGlobalCode() {
        if (this._cached_global_code) return this._cached_global_code;
        return Model.GetGlobalCodeWith(this.addon_id, this.id);
    }
    static GetGlobalCodeWith(addon_id, model_id) {
        return `${addon_id}:${model_id}`;
    }

    _cached_local_code = null;
    GetLocalCode() {
        if (this._cached_local_code) return this._cached_local_code;
    }

    constructor({ id='', load=function(){}, _global=false }) {
        this.gloabls = Model.Globals;
        if (_global) {
            Model.Globals.push(this);
        }

        // Копирование параметров из переданного объекта
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }
    }
}