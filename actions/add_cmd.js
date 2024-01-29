import { join } from 'path';
import { pathToFileURL } from 'url';


export function AddCmd({ addon_name, cmd_path, need_controller = false }) {
    // Взять input если это необходимо

    const toAddonPath = pathToFileURL(`../addons/${addon_name}/`);

    const config_task = WriteToConfig({
        toCfgPath: join(toAddonPath, 'addon_config.json'),
    });
    const files_task = WriteFiles({
        toViewPath: join(toAddonPath, 'views'),
        toCtrPath: join(toAddonPath, 'controllers'),
    })
    Promise.all([config_task, files_task]).then(async() => {
        console.log('Комманда добавлена');
    });
}



async function WriteToConfig({ toCfgPath }) {

}

async function WriteFiles({ toViewPath, toCtrPath }) {

}


const args = {
    addon_name: 'base',
};

AddCmd({
    addon_name: args.addon_name,

})