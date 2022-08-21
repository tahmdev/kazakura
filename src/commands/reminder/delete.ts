import {
  AutocompleteInteraction,
  Client,
  CommandInteraction,
} from "discord.js";
import { cache } from "../../cache/cache";

export async function autoComplete(
  interaction: AutocompleteInteraction,
  client: Client
) {
  const { guildId } = interaction;
  const { id } = interaction.user;
  if (!guildId || !id) return;
  const focusedValue = interaction.options.getFocused();
  const reminders = cache.reminders
    .filter((el) => el.author === id)
    .sort((a, b) => +a - +b);
  const choices = reminders.map((el) => {
    const now = Math.floor(new Date().getTime() / 1000);
    const difference = el.time - now;
    const days = Math.floor(difference / 86400);
    const hours = Math.floor((difference % 86400) / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m | ${el.message || ""}`;
  });
  const filtered = choices.filter((el) => el.startsWith(focusedValue));
  await interaction.respond(filtered.map((el) => ({ name: el, value: el })));
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const { guildId } = interaction;
  if (!guildId)
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });

  try {
    return interaction.reply(`Return`);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
