import { SlashCommandBuilder } from "discord.js";


export default {
    builder: new SlashCommandBuilder()
        .setName('рулетка').setDescription('Запуск игровой сессии в этом канале'),

    async run(ctx) {
        // Исходы
        //  Игра уже запущена
        //  Запуск игры, затем отправка сообщения о состоянии игры глобально
        //  * Настройка игры * (возможно)
        let game_state = {};

        const result = ctx.controller.StartGame(ctx.interaction?.channelId, {
            on_success: async () => {
                game_state = await this.messages.send('game_state', ctx.interaction, {
                    initiator: ctx.interaction.userId,
                    bet_config: {
                        min: 5,
                        max: 250,
                        variants: [5, 10, 15, 20, 25, 50]
                    },
                    round_time: 5,
                    on_help_click: (l) => {
                        if (this.controller.Authorized(l.user.id))
                            this.messages.send('help', l);
                        else
                            this.messages.send('not_authorized', l);
                    },
                    on_join_click: (l) => {
                        if (this.controller.Authorized(l.user.id)) {
                            console.log('[EVENT] User trying to join: ', l.user.id);
                        }
                        else
                            this.messages.send('not_authorized', l);
                    }
                });

                ctx.interaction?.reply({
                    content: 'Игра запущена',
                    ephemeral: true,
                })
                function game_loop() {
                    game_state.start_timer(2)
                        .then(() => {
                            ctx.controller.GameLoop(ctx.interaction.channel.id);
                            game_loop()
                        });
                } game_loop();
            },
            on_fail() {
                this.messages.send('launch.fail', ctx.interaction, {});
            },
            on_cancel: (user_id) => {
                game_state.remove();
            },
            on_bet: (table, p_id) => {
                //
            },
            on_second(table, new_val) {
                game_state.timer_update(new_val)
            },
            on_turn_end: (table, numbers) => {
                // change content with new last_games data
                game_state.last_bets_update(numbers);
            },
            on_join: (table) => {
                // change content with new players data
            },
            on_quit: (table) => {
                // change content with new players data
            },
        });
    },
}