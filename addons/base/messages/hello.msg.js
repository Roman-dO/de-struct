import { ActionRowBuilder, ButtonBuilder } from "discord.js";


export default {
    async send({ name }) {
        const i = this.interaction;

        const confirm = new ButtonBuilder()
            .setCustomId('share')
            .setLabel('Поделиться')
            .setStyle('Primary');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Отмена')
            .setStyle('Danger');

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        const msg = await i.reply({
            content: `Привет, ${name}!`,
            components: [row],
            ephemeral: true,
        });

        const adapter = await this.BindAdapter(msg);
        adapter.reg([
            {
                event_id: 'ch',
                action: async() => {
                    msg.edit({ content: 'F', components: [], ephemeral: false });
                    adapter.run({ code: 'share1' })
                        .catch(e => msg.edit({ content: 'Ошибка при отправке сообщения' }));
                }
            },
            {
                event_id: 'share',
                action: async() => {
                    msg.edit({ content: 'А кому???', components: [] });
                }
            },
            {
                event_id: 'end',
                action: async() => {
                    msg.edit({ content: 'На этом все .-.', components: [] });
                }
            },

        ]);


        // setTimeout(() => {
        //     adapter.run({ event_id: 'ch' });
        // }, 150);
        return adapter;
    }
}