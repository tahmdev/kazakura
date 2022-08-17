import { SlashCommandBuilder, CommandInteraction, Client } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll");
export async function execute(interaction: CommandInteraction, client: Client) {
  //ADD r Get
}
