export default {
    GetPlayer(id) {
        const glob = this.globals['base:player'];
        const player = glob.GetPlayer(id);

        return player? player: false;
    },

    load() {
        
    },
}