import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  ModalSubmitInteraction,
} from "discord.js";
import * as subCommandModules from "./reminder/index";
export const data = new SlashCommandBuilder()
  .setName("r")
  .setDescription("Set, get and delete reminders")
  .addSubcommand((subCommand) =>
    subCommand
      .setName("set")
      .setDescription("Set a reminder")
      .addNumberOption((option) =>
        option.setName("days").setDescription("Set amount of days ")
      )
      .addNumberOption((option) =>
        option.setName("hours").setDescription("Set amount of hours")
      )
      .addNumberOption((option) =>
        option.setName("minutes").setDescription("Set amount of minutes")
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("Enter a message to send with the reminder")
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
