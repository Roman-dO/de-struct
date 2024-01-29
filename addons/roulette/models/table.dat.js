const table = {
    actives: {},
    n_winner: 0,

    generate_winner() {
        this.n_winner = Math.floor(Math.random() * 37);
        console.log('next winner: ', this.n_winner);
    },

    table_exists(c_id) {
        return this.actives[c_id];
    },

    join(g_id, p_id) {
        const players = this.globals['base:players'];

        // Проверка игрока на существование
        const t_player = players.GetPlayer(p_id);
        if (!t_player) return { success: false, };

        // Нахождение нужного стола по g_id
        if (this.table_exists[g_id]) return { success: false, };

        const target_table = this.actives[g_id];
        if (target_table.players.find(el => el.id === p_id))
            return { success: false, };

        target_table?.players.push({
            id: p_id,

            link: t_player,

            // Добавить ссылки на нужные для сообщений события
        });
    },

    // Должен возвращать код, а контроллер отдавать свою реакцию в зависимости от кода
    start(channel_id, data) {
        console.log(`Попытка запуска игры в ${channel_id}`);

        if (this.table_exists(channel_id))
            return { success: false };

        const o = {
            c_id: channel_id,
            players: [],

            on_turn_end: (table, number) => data?.on_turn_end(table, number),
            on_join:     (table, u_id) => data?.on_join(table, u_id),
            on_cancel:   (table) => data?.on_cancel(table),
            on_quit:     (table) => data?.on_quit(table),
            on_bet:      (table, u_id) => data?.on_bet(table, u_id),
            on_second:   (new_val) => data?.on_second(new_val),

            // Возможно ненужно если все пробросить через "ссылки" выше
            state_message: {},
        }

        this.generate_winner();

        this.actives[channel_id] = o;
        return Object.assign(o, {
            success: true
        });
    },
    turn_end: () => {
        const winner = this.n_winner;
        this.generate_winner();

        
    },

    load() {

    }
};

export default table;