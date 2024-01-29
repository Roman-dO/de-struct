import { Addon } from './loader/addon.js';


// Boot all loader modules
import './loader/command.js'
import './loader/message.js'
import './message_adapter.js'
import './loader/config.js'
import './loader/model.js'
import './loader/command/view.js'
import './loader/command/controller.js'


export class AddonLoader {
    static async LoadAddons() {
        return await Addon.BuildList();
    }
}

