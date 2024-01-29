export default {
    PlayerExists(uid) {
        const player_model = this.GetModel('base:player');
        const player = player_model.GetPlayer(uid);

        if (!player) return { success: false };
        return player;
    },
    CreatePlayer(id) {
        const player_model = this.GetModel('base:player');
        const res = player_model.CreatePlayer({ id });
    }
}