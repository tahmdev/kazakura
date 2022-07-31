import { Client } from "discord.js";
import * as commandModules from "../commands/index";

export default (client: Client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const commands = Object(commandModules);
    const { commandName } = interaction;
    commands[commandName].execute(interaction, client);
  });
};
