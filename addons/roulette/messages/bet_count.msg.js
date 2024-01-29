import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";


// Сделать много реакций для каждой ставки

export default {
    async send(i, data) {
        const confirm = new ButtonBuilder()
            .setCustomId('minus')
            .setLabel('-')
            .setStyle('Primary');

        const cancel = new ButtonBuilder()
            .setCustomId('plus')
            .setLabel('+')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);


        const msg = await i.reply({
            content: `Ваша ставка: XX`,
            components: [row],
            ephemeral: true,
        });


        const exported = {

        };
        const collector = msg.createMessageComponentCollector({
            filter: l => l.user.interaction === i.user.interaction,
            time: 999_000,
        });
        collector.on('collect', async l => {
            switch (l.customId) {
                case 'plus':
                    data?.on_minus_click(l);
                    break;
                case 'minus':
                    data?.on_plus_click(l);
                    break;
            }
        });

        return exported;
    }
}