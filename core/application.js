import Storage from '../utils/storage.js';
import Config from '../config.js';
import { client } from '../utils/ds.js';


global.Application = {
    utils: {
        storage: Storage,
    },
    config: Config.app_cfg,
    online: Config.online,
    debug: Config.debug,

    client: client,

    // For creating bot
    reactions: [],
}

