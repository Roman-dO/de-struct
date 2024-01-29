import url from "url";
import fs from "node:fs";
import path, { join } from "path";

import { Config } from './config.js';
import { Command } from './command.js';
import { Model } from './model.js';
import { Message } from "./message.js";


export class Addon {
    static list = [];

    commands = [];
    models = [];
    messages = [];

    async Apply() {
        for (let key in this.commands) {
            this.commands[key].addon = this;
        }
        for (let key in this.models) {
            this.models[key].addon = this;
        }
    }

    static GetUploadCommands() {
        const commands = [];
        for (let key in this.list) {
            const addon = this.list[key];
            commands.push(...addon.commands);
        }
        return commands;
    }

    static async BuildList() {
        // Получение пусти до файла + проверка существования директории
        const path_uri = url.pathToFileURL('./addons');
        if (!fs.existsSync(path_uri))
            throw Err.NoAddonsFolder({});

        let folder_content = fs.readdirSync(path_uri, {withFileTypes: true});

        // Исключение загрузчика
        const loader_index = folder_content.findIndex(el => el.name === 'loader');
        if (loader_index !== -1)
            folder_content.splice(folder_content.findIndex(el => el.name === 'loader'), 1);

        folder_content = folder_content.filter(el => el.isDirectory());

        const urls = folder_content.map(el => url.pathToFileURL(path.join(el.path, el.name)));
        for (let uri of urls) {
            let config = {};
            try {
                config = await Config.Create({uri: uri.href});
                if (!await config.CheckValid()) continue;
            } catch (e) {
                throw Err.InvalidAddonConfig({ location: uri.href })
            }

            let globals = await config.GetGlobalModels();
            for (let key in globals) {
                let model_data = globals[key];
                const import_mod_task = import(path.join(uri.href, 'models', model_data.path + '.dat.js'));
                import_mod_task.then(async (module) => {
                    return await Model.Create({
                        uri: uri,
                        model_id: model_data.id,
                        addon_id: config.id,
                        module: module.default,
                        _global: true,
                    })
                })
                .catch(e => {
                    throw Err.ModelBuild({
                        code: Model.GetGlobalCodeWith(config.id, model_data.id),
                        _global: true
                    });
                })
            }
        }
        await Promise.all(Model.GlobalsReadyArray);

        const addon_create_tasks = [];
        for (let folder of folder_content) {
            const folder_path_uri = url.pathToFileURL(join(folder.path, folder.name, '/'));

            // Сборка объекта аддона из пути
            let proc = Addon.Create({uri: folder_path_uri})
                .catch(e => {
                    console.error(Err.AddonBuild({ id: folder_path_uri }));
                });
            addon_create_tasks.push(proc);
        }

        await Promise.all(addon_create_tasks);

        return this.list;
    }

    static async Create({ uri }) {
        let config = await Config.Create({uri: uri.href});
        if (!config.CheckValid()) {
            throw config.error;
        }
        console.log('CREATING: ', uri.href);

        // MESSAGES WORKING
        const messages_tasks = [];
        if (config.messages_list) {
            for (let message_data of config.messages_list) {
                messages_tasks.push(Message.Create({
                    uri: uri,
                    path: message_data.path,
                    id: message_data.code,
                    need_controller: message_data.need_controller,
                }).catch(e => {
                    throw Err.MessageBuild({});
                }));
            }
        }

        // key => model
        const local_models_tasks = [];
        if (config.models_list) {
            for (let model_data of config.models_list) {
                try {
                    if (model_data.global) {
                        const created = Model.Globals.find(el =>
                            el.addon_id === config.id && el.id === model_data.id
                        );
                    } else {
                        const import_mod_task = import(path.join(uri.href, 'models', model_data.path + '.dat.js'));
                        const after_import_task = import_mod_task.then(async module => {
                            module = module.default;
                            const createModelTask = Model.Create({
                                uri: uri,
                                model_id: model_data.id,
                                addon_id: config.id,
                                module: module,
                            });

                            return await createModelTask;
                        });
                        local_models_tasks.push(after_import_task);
                    }
                } catch (e) {
                    throw Err.ModelBuild({
                        code: Model.GetGlobalCodeWith(config.id, model_data.id)
                    });
                }
            }
        }
        const local_models = await Promise.all(local_models_tasks);
        const messages = await Promise.all(messages_tasks);

        // [ command, ... ]
        const commands = [];
        for (let i in config.command_list) {
            try {
                const cmd_data = config.command_list[i];
                const cmd = await Command.Create({
                    uri: uri,
                    path: cmd_data.path,
                    need_controller: cmd_data.need_controller,
                    models: local_models,
                });
                if (cmd) commands.push(cmd);
                else {
                    throw Err.UnreachableCode({});
                }
            } catch (e) {
                console.log(e)
            }
        }
        console.log(`Начало сборки аддона ${config.id}`);
        const addon = new Addon({
            id: config.id,
            commands: commands,
            models: local_models,
            messages: messages,
        });

        await addon.Apply()
            .catch(console.log);
        return addon;
    }

    constructor({id, commands = [], models = [], messages = []}) {
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }

        Addon.list.push(this);
    }
}
