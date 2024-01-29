import {ActionRowBuilder, ButtonBuilder, EmbedBuilder} from "discord.js";


export default {
    async send(i, data) {
        const confirm = new ButtonBuilder()
            .setCustomId('join')
            .setLabel('Учавствовать')
            .setStyle('Primary');

        const cancel = new ButtonBuilder()
            .setCustomId('help')
            .setLabel('Как играть?')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        const content_embed = new EmbedBuilder()
            .setTitle('Игра идет, до конца хода: XX сек')
            .setDescription('Прошлые числа: 0, 00, 36, 2 ..')

        const statics = {
            timer: 0,
            last_bets: [],
        };
        const LAST_BETS_LENGTH = 4;

        const UpdateEmbed = () => {
            let desc = '';
            if (statics.last_bets.length === 0) {
                desc = 'Прошлые числа: нет';
            }
            else {
                let desc = `Прошлые числа: `;
                for (let i in statics.last_bets) {
                    const el = statics.last_bets[i];
                    desc += `${el}, `;
                }
                desc += ' ..';
            }
            content_embed
                .setTitle(`Игра идет, до конца хода: ${statics.timer} сек`)
                .setDescription(desc);
        };

        const msg = await i.channel.send({
            content: `Игра идет...`,
            embeds: [
                new EmbedBuilder()
                    .setTitle('Игра идет, до конца хода: XX сек')
                    .setDescription('Прошлые числа: 0, 00, 36, 2 ..')
            ],
            components: [row],
        });

        const UpdateMessageWithEmbeds = () => {
            msg.edit({
                embeds: [content_embed],
            })
        }


        const r_data = {
            remove: () => {
                msg.remove();
            },
            start_timer: async (timer) => await new Promise((res, rej) => {
                const interval = setInterval(() => {
                    timer--;

                    UpdateEmbed();
                    UpdateMessageWithEmbeds();

                    if (timer === 0) { clearInterval(interval); res(); }
                }, 1000);
            }),
            add_number_to_lasts: (number) => {
                if (statics.last_bets.length > LAST_BETS_LENGTH)
                    delete statics[0];

                statics.push(number);
            },


            // Новый способ работы данных
            timer_update(new_val) {
                statics.timer = new_val;

                UpdateEmbed();
                UpdateMessageWithEmbeds();
            },
            last_bets_update(new_val) {
                statics.last_bets = new_val;

                UpdateEmbed();
                UpdateMessageWithEmbeds();
            },
        };
        const collector = msg.createMessageComponentCollector({
            filter: l => l.user.interaction === i.user.interaction,
            time: 100_000
        });
        collector.on('collect', async l => {
            switch (l.customId) {
                case 'help':
                    data?.on_help_click(l);
                    break;
                case 'join':
                    data?.on_join_click(l);
                    break;
                default:
                    console.log('collect сработало с элементом: ', l);
                    break;
            }
        });
        return r_data;
    }
}