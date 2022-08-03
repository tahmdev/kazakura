import "dotenv/config";
import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import * as commandModules from "./commands/index";

const { TOKEN: TOKEN, LIENT_ID: CLIENT_ID } = process.env;
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
        `Successfully registered ${commands.length} application commands.`
      )
    )
    .catch(console.error);
}
