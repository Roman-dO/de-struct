export default {
    RegisterNewPlayer(uid) {
        return this.GetModel('base:player').CreatePlayer({
            id: uid
        });
    }
}