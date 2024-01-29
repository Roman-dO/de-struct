import { EmbedBuilder } from "discord.js";


export default {
    async send({  }) {
        const i = this.interaction;
        const content_embed = new EmbedBuilder()
            .setTitle('Вы не авторизованы')
            .setDescription('Попробуйте использовать команду `/reg`, чтобы авторизоваться');
        let msg = await i.reply({
            content: '',
            embeds: [content_embed],
            ephemeral: true,
        });

        const adapter = await this.BindAdapter(msg);

        adapter.reg([
            {
                event_id: 'reg-success',
                action: async() => {
                    const receivedEmbed = msg.embeds[0];
                    receivedEmbed.setTitle('Вы зарегистрированы');
                    receivedEmbed.setDescription('Можете использовать комманду /help');
                    msg.edit({
                        embeds: [ receivedEmbed ],
                        buttons: [],
                    });
                }
            },
            {
                event_id: 'reg-failed',
                action: async() => {
                    const receivedEmbed = msg.embeds[0];
                    receivedEmbed.setTitle('Ошибка во время регистрации');
                    receivedEmbed.setDescription(
                        'Для регистрации введите /reg, при повторении ошибок ' +
                        'При повторном возникновении ошибок обратитесь к администратору.-.');
                    msg.edit({
                        embeds: [ receivedEmbed ],
                        buttons: [],
                    });
                }
            },
            {
                event_id: 'reg-started',
                action: async() => {
                    const receivedEmbed = msg.embeds[0];
                    receivedEmbed.setTitle('Регистрация идет...');
                    receivedEmbed.setDescription('..--.. ..--..');
                    msg.edit({
                        embeds: [ receivedEmbed ],
                        buttons: [],
                    });
                }
            },
        ]);
        await adapter.run({ event_id: 'reg-started' });
        return adapter;
    }
}