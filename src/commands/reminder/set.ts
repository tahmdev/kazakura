import { Client, CommandInteraction } from "discord.js";
import { db } from "../../firebase";

export async function execute(interaction: CommandInteraction, client: Client) {
  const days = Number(interaction.options.get("days")?.value) * 86400 || 0;
  const hours = Number(interaction.options.get("hours")?.value) * 3600 || 0;
  const minutes = Number(interaction.options.get("minutes")?.value) * 60 || 0;
  const message = interaction.options.get("message")?.value || "";
  const now = Math.floor(new Date().getTime() / 1000);
  const reminderTime = now + days + hours + minutes;
  const authorId = interaction.user.id;

  if (reminderTime <= now)
    return interaction.reply({
      content: "Please make sure the reminder is set in the future.",
      ephemeral: true,
    });

  try {
    await db
      .collection(`users/${authorId}/reminders`)
      .doc()
      .create({ time: reminderTime, message, createdAt: now });
    return interaction.reply({
      content: `Reminder set for <t:${reminderTime}:F>.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
