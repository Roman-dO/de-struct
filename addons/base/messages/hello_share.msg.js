import { ActionRowBuilder, ButtonBuilder } from "discord.js";


export default {
    async send(i, data) {
        const msg = await i.channel.send({
            content: `${data.name} поделился свой статистикой!`,
        });

        const r_data = { onComponentInteraction: [] };
        const collector = msg.createMessageComponentCollector({ filter: l => l.user.interaction === i.user.interaction, time: 100_000 });

        collector.on('collect', async l => {
            for (let f of r_data.onComponentInteraction) {
                await f(l);
            }
        });
        return r_data;
    }
}