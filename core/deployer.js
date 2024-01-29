import { REST, Routes } from "discord.js";
import Config from "../config.js";
import { Reaction } from "./deployer/reaction.js";


export class Deployer {
    static async UploadCommands({ commands_list }) {
        await (new REST({version: '10'}).setToken(Config.token)).put(
            Routes.applicationCommands(Config.clientId),
            { body: commands_list.map(el => el.view.builder) }
        );

        console.log(`Загружено ${Object.keys(commands_list).length} (/) комманд`);
        return await Promise.all(commands_list.map(async command =>
            await Reaction.Create({
                builder: command.view.builder,
                command: command,
            }))
        );
    }
}

