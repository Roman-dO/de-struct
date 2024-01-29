import {Events} from "discord.js";

export class MessageAdapter {
    time = 1000_0;
    message = {};
    actions = {};


    static async Create({ message }) {
        return new MessageAdapter({
            message
        });
    }

    reg({ event_id, action }) {
        if (Array.isArray(arguments[0])) {
            for (let key in arguments[0]) {
                let el = arguments[0][key];
                this.actions[el.event_id] = async (...args) => await el.action(...args);
            }
            this.actions[event_id] = async (...args) => await action(...args);
        }
        else {
            this.actions[event_id] = async (...args) => await action(...args);
        }
    }

    async invoke({ interaction }) {
        const event_id = interaction.customId;
        const action_candidate = this.actions[event_id]
        if (!action_candidate)
            return;

        await action_candidate.bind({
            interaction,
            from_event: true,
            ...this.message,
        })();
    }

    async run({ code, ...data }) {
        const action_candidate = this.actions[code]

        if (!action_candidate) {
            console.log(`From actions: ${Object.keys(this.actions)} received ${code}`);
            return;
        }
        await action_candidate.bind({
            from_code: true,
            ...this.message,
        }, { ...data })();
    }

    setup() {
        this.collector = this.message.createMessageComponentCollector({ time: "10000" });
        this.collector.on('collect', async i => {
            this.invoke({ interaction: i })
            .catch(e => console.log(e))
        });
    }

    constructor({ message, time=100_0 }) {
        this.message = message;
        this.time = time;

        try {
            this.setup();
        } catch (e) {
            throw e;
        }
    }
}

