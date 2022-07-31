import { SlashCommandBuilder, CommandInteraction, Client } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("t")
  .setDescription("Post a tag in chat");
export async function execute(interaction: CommandInteraction, client: Client) {
  interaction.reply({ content: "aaaa" });
}
