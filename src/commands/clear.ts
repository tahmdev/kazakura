import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  TextChannel,
} from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clear the last N messages")
  .addIntegerOption((option) =>
    option.setName("amount").setDescription("Amount of messags to delete")
  );
export async function execute(interaction: CommandInteraction, client: Client) {
  const n = interaction.options.get("amount")?.value || 5;
  const channel = interaction.channel as TextChannel;
  await interaction.deferReply();
  await channel.bulkDelete(Number(n));
  await channel.send(`Deleted ${n} messages`);
  return;
}
