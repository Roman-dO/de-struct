export default {
    StartGame(channel_id, data) {
        const result = this.models.table?.start(channel_id, data);

        if (result?.success)
            data?.on_success();
        else
            data?.on_fail();

        // Подписка на все, что нужно
        return result;
    },
    JoinGame(g_id, p_id) {
        // Регистрация пользователя в игру+++++
    },
    GameLoop(g_id) {
        // Логическая часть игры - генерация числа, возвращение денег победителям,
        //  возвращает объекты для уведомлений пользователей (много)

    },
    GameSecondFrame() {

    },
    Authorized(u_id) {
        const player = this.models.player.GetPlayer(u_id);
        console.log('question from ', u_id)
        console.log('player????  ', !!player)
        return !!(player);
    },
}