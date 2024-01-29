import mongoose from 'mongoose';


await Application.mongo_rdy;

const balanceStorySchema = new mongoose.Schema({
    value: {type: Number, required: true},
    date: {type: Date, default: Date.now},
});
export const PlayerSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true }, // discord id
    balance: { type: Number, default: 50 },
    is_admin: { type: Boolean, default: false },

    balance_story: { type: [balanceStorySchema], default: [] },
    register_date: { type: Date, default: Date.now },
}, {
    statics: {

    },
    methods: {
        HasBalance(count) {
            return this.balance > count;
        },
        async ChangeBalance(balance) {
            this.balance += balance;
            this.balance_story.push({ value: balance });
            this.save();
        },
    }
});

export const Player = mongoose.model('player', PlayerSchema);


