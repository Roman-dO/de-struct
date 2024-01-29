import { EmbedBuilder } from "discord.js";



export default {
    send(i) {
        let msg = {};
        const content_embed =  new EmbedBuilder()
            .setTitle('Помощь')
            .setDescription('Помощь по работе рулетки в боте <@1053267147557703680>');
7
        try {
            msg = i.reply({
                embeds: [content_embed],
                ephemeral: true,
            });
        }
        catch (e) {
            msg = i.channel.send({
                embeds: [content_embed],
            });
        }
        return msg;
    }
}