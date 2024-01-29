import { Player } from "../autoload/models.js";


export default {
    async CreatePlayer({ id }) {
        if (typeof id === 'undefined')
            return false;

        let player = new Player({ id });

        return await player.save()
        .then(() => {
            return { success: true };
        })
        .catch(e => {
            return { success: false };
        });
    },
    PlayerExists({ id }) {
        return Player.exists({ id });
    },
    GetPlayer({ id }) {
        return Player.findOne({ id });
    },
    reset() {
        Player.deleteMany({});
    },
    load() {

    },
}