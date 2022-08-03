import "dotenv/config";
import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  ActivityType,
} from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("set_status")
  .setDescription("Sets the bots status")
  .addStringOption((option) =>
    option.setName("status").setDescription("Enter a status").setRequired(true)
  )
  .setDMPermission(false)
  .setDefaultMemberPermissions(0);
export async function execute(interaction: CommandInteraction, client: Client) {
  if (interaction.user.id !== process.env.OWNER_ID)
    return interaction.reply({
      content: `This command is only usable by <@966692536758452315>.`,
    });

  try {
    const status = interaction.options.get("status")?.value?.toString();
    client.user?.setActivity({
      name: status,
      type: ActivityType.Playing,
    });
    return interaction.reply({ content: "Updated status.", ephemeral: true });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong",
      ephemeral: true,
    });
  }
}
