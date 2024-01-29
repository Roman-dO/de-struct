import { View }  from './command/view.js';
import { Controller } from './command/controller.js';
import { MessageAdapter } from "../message_adapter.js";
import {Model} from "./model.js";


export class Command {
    addon = {};
    view = {};
    controller = {};


    async Run({ interaction }) {
        await this.view.run.bind({
            command: this,
            controller: this.controller,
            send: async ({ code, ...args }) => {
                const candidate = this.addon.messages.find(el => el.id === code);
                if (candidate) {
                    candidate.send.bind({
                        interaction: interaction,
                        BindAdapter: async (message) => await MessageAdapter.Create({
                            message: message
                        })
                    }, { ...args })();
                }
                else {
                    console.log(`Ошибка, среди`, this.addon.messages, ' не найдено элемента с id: ', code);
                }
            }
        }, {
            interaction: interaction
        })();
    }

    GetName() {
        return this.view.builder.name;
    }

    static async Create({ uri="", path="", need_controller=false, models=[] }) {
        try {
            let controller = false;
            if (need_controller) {
                controller = await Controller.Create({
                    path: `${uri}/controllers/${path}`,
                    global_models: Model.Globals,
                    local_models: models,
                })
                .catch(e => {
                    throw Err.ControllerBuild({ location: `${uri}/controllers/${path}` });
                });
            }
            const view = await View.Create({
                path: `${uri}/views/${path}`,
                controller,
            })
            .catch(e => {
                throw Err.ViewBuild({ location: `${uri}/views/${path}` });
            });

            return new Command({
                view,
                controller,
            });
        }
        catch (e) {
            throw Err.CommandBuild({ uri });
        }
    }

    constructor({ view={}, controller={}, models=[] }) {
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }
    }
}