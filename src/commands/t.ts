import {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { tagCache } from "../cache/tags";
export const data = new SlashCommandBuilder()
  .setName("t")
  .setDescription("Post a tag in chat")
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Enter a tag to post")
      .setAutocomplete(true)
      .setRequired(true)
  )
  .setDMPermission(false);
export async function autoComplete(
  interaction: AutocompleteInteraction,
  client: Client
) {
  if (!interaction.guildId) return;
  const focusedValue = interaction.options.getFocused().toLocaleLowerCase();
  const choices = Object.keys(tagCache.cache[interaction.guildId] || {});
  const filtered = choices.filter((el) => el.startsWith(focusedValue));
  await interaction.respond(filtered.map((el) => ({ name: el, value: el })));
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const { guildId } = interaction;
  const tag = interaction.options.get("tag")?.value?.toString().trim();
  if (!guildId || !tag)
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });

  const { content } = tagCache.cache[guildId]?.[tag] || {};
  if (!content)
    return interaction.reply({
      content: `No tag called \`${tag}\``,
      ephemeral: true,
    });
  return interaction.reply({ content: `${content}` });
}
