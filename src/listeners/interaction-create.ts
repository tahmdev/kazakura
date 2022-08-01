import { Client, InteractionType } from "discord.js";
import * as commandModules from "../commands/index";

export default (client: Client) => {
  client.on("interactionCreate", async (interaction) => {
    if (
      !interaction.isCommand() &&
      !interaction.isAutocomplete() &&
      !interaction.isModalSubmit()
    )
      return;
    const commands = Object(commandModules);

    if (interaction.type === InteractionType.ModalSubmit) {
      const { customId } = interaction;
      const key = customId.split(".")[0];
      commands[key].handleModal(interaction, client);
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      const { commandName } = interaction;
      commands[commandName].autoComplete(interaction, client);
    } else {
      const { commandName } = interaction;
      commands[commandName].execute(interaction, client);
    }
  });
};
