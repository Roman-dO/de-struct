import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";


// Сделать много реакций для каждой ставки

export default {
    async send(i, data) {
        const msg = await i.reply({
            content: `Ошибка при запуске игры в канале!`,
            ephemeral: true,
        });

        return msg;
    }
}