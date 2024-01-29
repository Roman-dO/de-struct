import { Client, GatewayIntentBits } from 'discord.js'
import Config from '../config.js';


export const client = new Client({
    intents: [ GatewayIntentBits.Guilds ],
});


export async function Login() {
    await client.login(Config.token)
      .catch(e => {
        console.log('Error: ', e);
      });
    return client;
}
