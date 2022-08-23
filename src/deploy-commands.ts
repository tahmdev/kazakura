import "dotenv/config";
import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import * as commandModules from "./commands/index";

const { TOKEN, CLIENT_ID, LIVE_TOKEN, LIVE_CLIENT_ID, NODE_ENV } = process.env;
let token;
let clientId;
if (NODE_ENV === "live") {
  token = LIVE_TOKEN;
  clientId = LIVE_CLIENT_ID;
} else {
  clientId = CLIENT_ID;
  token = TOKEN;
}

const commands = [];

for (const module of Object.values<any>(commandModules)) {
  commands.push(module.data);
}
if (TOKEN !== undefined && CLIENT_ID !== undefined) {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  rest
    .put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })
    .then(() =>
      console.log(
        `Successfully registered ${
          commands.length
        } application commands to the ${
          NODE_ENV === "live" ? "LIVE" : "DEV"
        } build.`
      )
    )
    .catch(console.error);
}
