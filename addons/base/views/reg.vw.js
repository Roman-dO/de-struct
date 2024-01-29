import { SlashCommandBuilder } from "discord.js";


export default {
    builder: new SlashCommandBuilder()
        .setName('reg').setDescription('Регистрация пользователя'),

    async run({ interaction }) {
        const controller = this.controller;

        try {
            const uid = interaction.user.id;

            const success = controller.RegisterNewPlayer(uid);
            if (success) {
                interaction.reply({
                    content: 'Вы успешно зарегистрированны!',
                    ephemeral: true,
                });
            }
            else {
                interaction.reply({
                    content: 'Ошибка во время регистрации.\nВозможно вы уже зарегистрированны?',
                    ephemeral: true,
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}