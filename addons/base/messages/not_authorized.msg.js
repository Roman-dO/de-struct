import {ActionRowBuilder, ButtonBuilder, EmbedBuilder} from "discord.js";


export default {
    async send({ }) {
        const i = this.interaction;

        const register_btn = new ButtonBuilder()
            .setCustomId('reg')
            .setLabel('/reg')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(register_btn);
        const embed = new EmbedBuilder().setTitle('Вы не авторизованы')
            .setDescription('Попробуйте использовать команду (/) "/reg", чтобы авторизоваться')

        const msg = await i.reply({
            embeds: [ embed ],
            components: [row],
            ephemeral: true,
        });

        const adapter = await this.BindAdapter(msg);
        adapter.reg([
            {
                event_id: 'reg-1',
                action: async() => {
                    embed.setTitle('Вы зарегистрированы');
                    embed.setDescription('Можете использовать комманду /help');
                    msg.edit({
                        embeds: [ embed ],
                        buttons: [],
                    });
                }
            },
            {
                event_id: 'reg-0',
                action: async() => {
                    embed.setTitle('Ошибка во время регистрации');
                    embed.setDescription(
                        'Для регистрации введите /reg, при повторении ошибок ' +
                        'При повторном возникновении ошибок обратитесь к администратору.-.');
                    await msg.edit({
                        embeds: [ embed ],
                        buttons: [],
                    });
                }
            }
        ]);
        return adapter;
    }
}