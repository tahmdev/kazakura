import {
  CommandInteraction,
  Client,
  AutocompleteInteraction,
} from "discord.js";
import { cache } from "../../cache/cache";
import { db } from "../../firebase";

export async function autoComplete(
  interaction: AutocompleteInteraction,
  client: Client
) {
  const { guildId } = interaction;
  if (!guildId) return;
  const focusedValue = interaction.options.getFocused();
  const choices = Object.keys(cache.guild(guildId).tags || {});
  const filtered = choices.filter((el) => el.startsWith(focusedValue));
  await interaction.respond(filtered.map((el) => ({ name: el, value: el })));
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const name = interaction.options.get("tag")?.value?.toString().trim();
  const { guildId } = interaction;
  if (!guildId || !name)
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });

  const { id } = cache.guild(guildId).tags[name] || {};
  if (!id) return interaction.reply(`Tag \`${name}\` does not exist.`);

  try {
    await db.doc(`guilds/${guildId}/tags/${id}`).delete();
    return interaction.reply(`Deleted \`${name}\``);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
