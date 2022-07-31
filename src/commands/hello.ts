import { SlashCommandBuilder, CommandInteraction, Client } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Returns a greeting");
export async function execute(interaction: CommandInteraction, client: Client) {
  interaction.reply({ content: "Hello there!", ephemeral: true });
}
