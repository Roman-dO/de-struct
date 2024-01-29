import { SlashCommandBuilder } from "discord.js";


export default {
    builder: new SlashCommandBuilder()
        .setName('hello').setDescription('Тест аддонов'),

    async run({ interaction }) {
        const ctr = this.controller;

        if (!ctr.PlayerExists(interaction.user.id)) {
            const msg = await this.send({ code: 'not_authorized' });

            msg.reg({
                event_id: 'reg',
                action: async() => {
                    const res = await ctr.CreatePlayer({ id: interaction.user.id });
                    if (res.success) msg.run({ code: 'reg-1' });
                    else             msg.run({ code: 'reg-0' });
                }
            });

            return;
        }

        const msg = await this.send({ code: 'eph-hello', name: interaction.user.name });
        const adapter = await this.BindAdapter(msg);
        adapter.reg({
            event_code: 'share',
            action: async() => {
                msg.run({ code: 'remove' });
                const shared_msg = await this.send({
                    code: 'shared_hello',
                    name: interaction.user.name,
                    id: interaction.user.id,
                });
            }
        });
    }
}
