

export class View {
    run = async () => {};
    controller = {};


    static async Create({ path, controller }) {
        const view_import_task = import(`${path}.vw.js`).then(module => module.default)
        .catch(e => {
            throw Err.ViewImport({ location: path });
        });

        const view_mod = await view_import_task;

        return new View({
            builder: view_mod.builder,
            run: view_mod.run,
            controller: controller
        });
    }

    async Execute({ interaction }) {
        console.log('run function -> ', this.run);

        this.run.bind({
            interaction: interaction,
            controller: this.controller,
        });
    }

    constructor ({ builder={}, run=()=>{}, controller }) {
        for (let key in arguments[0]) {
            this[key] = arguments[0][key];
        }
    }
}

