import {
  CommandInteraction,
  Client,
  AutocompleteInteraction,
} from "discord.js";
import { tagCache } from "../../cache/tags";
import { db } from "../../firebase";

export async function autoComplete(
  interaction: AutocompleteInteraction,
  client: Client
) {
  if (!interaction.guildId) return;
  const focusedValue = interaction.options.getFocused();
  const choices = Object.keys(tagCache.cache[interaction.guildId] || {});
  const filtered = choices.filter((el) => el.startsWith(focusedValue));
  await interaction.respond(filtered.map((el) => ({ name: el, value: el })));
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const tag = interaction.options.get("tag")?.value?.toString().trim();
  const { guildId } = interaction;
  if (!guildId || !tag) return interaction.reply(`Something went wrong.`);
  const { id } = tagCache.cache[guildId]?.[tag] || {};
  if (!id) return interaction.reply(`Tag \`${tag}\` does not exist.`);

  try {
    await db.doc(`guilds/${guildId}/tags/${id}`).delete();
    return interaction.reply(`Deleted \`${tag}\``);
  } catch (error) {
    console.error(error);
    return interaction.reply(`Something went wrong.`);
  }
}
