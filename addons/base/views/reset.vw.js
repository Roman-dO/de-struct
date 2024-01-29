import { SlashCommandBuilder } from "discord.js";


export default {
    builder: new SlashCommandBuilder()
        .setName('reset').setDescription('Сбросить все данные'),

    async run({ interaction }) {
        const ctr = this.controller;

        if (ctr.IsAdminById({ id: interaction.user.id })) {
            ctr.reset()
            .then(async() => {
                console.log('dropped');
            })
            .catch(async() => {
                console.log('not dropped');
            });
        }
        else {
            interaction.reply({ content: 'Ошибка, недостаточно прав для выполнения операции', ephemeral: true })
        }
    }
}