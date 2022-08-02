import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  PermissionFlagsBits,
  ModalSubmitInteraction,
} from "discord.js";
import * as subCommandModules from "./manageTags/index";

export const data = new SlashCommandBuilder()
  .setName("manage_tags")
  .setDescription("Add, edit, or delete tags")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand.setName("add").setDescription("Add a tag")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("edit")
      .setDescription("Edit a tag")
      .addStringOption((option) =>
        option
          .setName("tag")
          .setDescription("Enter a tag to edit")
          .setAutocomplete(true)
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("delete")
      .setDescription("Delete a tag")
      .addStringOption((option) =>
        option
          .setName("tag")
          .setDescription("Enter a tag to delete")
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
