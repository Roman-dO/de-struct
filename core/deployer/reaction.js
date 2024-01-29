export class Reaction {
    builder = {};
    command = {};

    async Execute(interaction) {
        return await this.command.Run({
            interaction: interaction,
        });
    }

    static async Create({ builder={}, command={} }) {
        return new Reaction({
            builder: builder,
            command: command,
        });
    }

    constructor({ builder= {}, command={} }) {
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }
    }
}