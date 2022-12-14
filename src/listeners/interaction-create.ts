import { Client, GuildMemberRoleManager, InteractionType } from "discord.js";
import { cache } from "../cache/cache";
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
      // Modal CustomIDs need to follow the pattern of CMDNAME.MODALNAME
      const key = customId.split(".")[0];
      commands[key].handleModal(interaction, client);
    }
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const { commandName } = interaction;
      commands[commandName].autoComplete(interaction, client);
    }
    if (interaction.type === InteractionType.ApplicationCommand) {
      const { commandName } = interaction;

      if (!interaction.channel) await interaction.user.createDM();
      if (interaction.channel?.type === 1 || commandName === "permissions") {
        return commands[commandName].execute(interaction, client);
      }

      const { guildId } = interaction;
      if (!guildId)
        return interaction.reply({
          content: "Something went wrong",
          ephemeral: true,
        });

      const permissions = cache.guild(guildId).permissions[commandName];
      const roles = (interaction.member?.roles as GuildMemberRoleManager).cache;

      if (!permissions) {
        return interaction.reply({
          content: "This command is not available on this server.",
          ephemeral: true,
        });
      }

      if (!roles.some((el) => permissions.includes(el.id))) {
        return interaction.reply({
          content:
            "You don't have the required permissions to run this command.",
          ephemeral: true,
        });
      }

      return commands[commandName].execute(interaction, client);
    }
  });
};
