import { SlashCommandBuilder } from "discord.js";


export default {
    builder: new SlashCommandBuilder()
        .setName('bet').setDescription('Присоединиться к активной игре'),

    async run(ctx) {
        const balance = ctx.controller.GetBalance(ctx.interaction.user.id);

        // Исходы
        //  Игра не запущена
        //  Отправка 2 сообщений: контроль суммы и поля
        //  * Ввод пароля * (возможно)

        // Нужные сценарии
        //  * Ставка принята через другое сообщение
        //  *

        if (balance === false) {
            ctx.interaction.reply({ content: 'Ты не зарегистрирован', ephemeral: true });
        }
        else {
            ctx.interaction.reply({ content: `Твой баланс: ${balance} монет`, ephemeral: true });
        }
    },
}