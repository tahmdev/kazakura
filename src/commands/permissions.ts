import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  PermissionFlagsBits,
  ModalSubmitInteraction,
} from "discord.js";
import * as subCommandModules from "./permissions/index";

export const data = new SlashCommandBuilder()
  .setName("permissions")
  .setDescription("Edit or get permissions for a command")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Add a tag")
      .addStringOption((option) =>
        option
          .setName("cmd")
          .setDescription("Select a command")
          .setAutocomplete(true)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("role")
          .setDescription("Select a command")
          .setAutocomplete(true)
          .setRequired(true)
      )
  );

export async function autoComplete(
  interaction: CommandInteraction,
  client: Client
) {
  const subCommands = Object(subCommandModules);
  const { name } = interaction.options.data[0];
  subCommands[name].autoComplete(interaction, client);
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const subCommands = Object(subCommandModules);
  const { name } = interaction.options.data[0];
  subCommands[name].execute(interaction, client);
}

export async function handleModal(
  interaction: ModalSubmitInteraction,
  client: Client
) {
  const subCommands = Object(subCommandModules);
  const { customId } = interaction;
  const key = customId.split(".")[1];
  subCommands[key].handleModal(interaction, client);
}
