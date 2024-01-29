
export class Config {
    _valid = false;
    __ok = false;

    static __cache = {};

    models_list = [];
    command_list = [];
    messages_list = [];

    id = '';
    version = '';

    async GetGlobalModels() {
        // Массив со всеми моделями с параметром global
        return this.models_list.filter(el => el.global);
    }

    async GetLocalModels() {
        return this.models_list.filter(el => !el.global);
    }

    CheckValid() {
        // TODO: Переделать анализ объекта из выражения в динамический алгоритм
        //       для записи причин невалидности файла, а затем
        //       возможности вынесения их в логи
        // TODO: Добавить проверки для command_list'а
        this._valid = (
            this.__ok &&
            (Object.hasOwn(this, 'id') &&
                typeof this.id === "string" &&
                this.id?.length > 0)
            && (Object.hasOwn(this, 'version') &&
                typeof this.version === "string" &&
                this.version?.length > 0)
            && (Object.hasOwn(this, 'command_list'))
        );
        return this._valid;
    }

    static async Create({ uri }) {
        if (this.__cache[uri]) return this.__cache[uri];

        try {
            const addon_cfg = new Config((await import(uri + '/addon_config.js')).default);
            this.__cache[uri] = addon_cfg;
            addon_cfg.__ok = true;
            return addon_cfg;
        }
        catch (e) { return { error: new Error(`Файл по пути ${uri}addon_config.js не получается подключить`), CheckValid: function() { return false } } }
    }

    constructor(ref) {
        Object.assign(this, ref);
    }
}