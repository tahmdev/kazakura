import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interaction-create";
import { startTimer } from "./timer/timer";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

ready(client);
interactionCreate(client);
startTimer(client);

client.login(process.env.TOKEN);
