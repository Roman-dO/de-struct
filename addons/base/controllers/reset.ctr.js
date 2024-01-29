
export default {
    IsAdminById(id) {
        return this.models['admins'].IsAdminById(id);
    },
    run(ctx) {
        try {
            this.models['player'].reset();
            console.log('[REMOVE] (/) Данные удалены!!!')
        }
        catch(e) {
            console.log(e)
        }
    }
}