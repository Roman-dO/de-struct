export default {
    GetBalance(uid) {
        const player = this.models.player.GetPlayer(uid);
        return player? player.balance: false;
    },
    
}