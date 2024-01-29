import { EmbedBuilder } from "discord.js";


export default {
    async send(data) {
        this.interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle(`Ваш баланс: ${data.balance}`)
                    .setDescription('Позже здесь будет больше возможностей..')
            ],
            ephemeral: true,
        });
    }
}