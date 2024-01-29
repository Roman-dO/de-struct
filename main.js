import { Events } from 'discord.js'

import { Deployer, AddonLoader, Addon } from './core/boot.js';
import { Login } from './utils/ds.js';
import './utils/mod_logger.js';

let start_date = new Date();

// Нужно для параллельного подключения к Discord и Сборка аддонов
const LaunchBot = new Promise((res, rej) => {
    Login()
    .then((client) => {
        client.once(Events.ClientReady, () => {
            console.log(`${client.user.username} [BOT] just launched`);
            res(client);
        });
    })
    .catch((e) => {
        rej(Err.LoginDiscordError({}));
    });
});
const BuildAddons = new Promise((res, rej) => {
    AddonLoader.LoadAddons()
    .then((list) => {
        res(list);
    })
    .catch(e => {
        rej(`[ERROR] Ошибка во время сборки команд `, e);
    })
});

Promise.all([ LaunchBot, BuildAddons ]).then(async(args) => {
    const commands = Addon.GetUploadCommands();

    const reactions = await Deployer.UploadCommands({
        commands_list: commands,
    });

    Application.client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const reaction = reactions.find(el => el.command.GetName() === interaction.commandName);

        // Запуск реакции
        new Promise(async(res, rej) => {
            await reaction
                .Execute(interaction)
                .catch(e => {
                    console.log(`Ошибка во время выполнения команды /${reaction.command.GetName()}`, e);
                });
        });
    });

    const loaded_diff = new Date(new Date() - start_date);
    console.log('Все загружено успешно за ' + loaded_diff.getMilliseconds() + 'мс.');
})
.catch(e => {
    console.error(`Завершение программы с ошибкой: `, e);
    process.exit(0);
});

