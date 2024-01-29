import mongoose from 'mongoose';


export async function ConnectMongoose() {
    Application.db_type = 'mongoose';
    await mongoose.connect('mongodb://127.0.0.1:27017/base')
        .then(() => {
            console.log('connected')
        }).catch(() => {
            console.log('error')
        });

    // const Player = mongoose.model('player-t', { name: String, balance: Number });
    // const me = await (new Player({ name: 'Roman', balance: 100 }).save());
}
Application.mongo_rdy = ConnectMongoose();
