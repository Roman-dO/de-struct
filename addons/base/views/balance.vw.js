import { SlashCommandBuilder } from "discord.js";


export default {
    builder: new SlashCommandBuilder()
        .setName('balance').setDescription('Показывает баланс'),

    async run(ctx={}) {
        const balance = ctx.controller.GetBalance(ctx.interaction.user.id);

        if (balance === false) {
            this.messages.send('not_authorized', ctx.interaction);
        }
        else {
            this.messages.send('balance', ctx.interaction, { balance: balance });
        }
    }
}