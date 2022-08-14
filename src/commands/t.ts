import {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { cache } from "../cache/cache";
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
  const { guildId } = interaction;
  if (!guildId) return;
  const focusedValue = interaction.options.getFocused().toLocaleLowerCase();
  const choices = Object.keys(cache.guild(guildId).tags || {});
  const filtered = choices.filter((el) => el.startsWith(focusedValue));
  await interaction.respond(filtered.map((el) => ({ name: el, value: el })));
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const { guildId } = interaction;
  const name = interaction.options.get("tag")?.value?.toString().trim();
  if (!guildId || !name)
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });

  const { content } = cache.guild(guildId).tags[name] || {};
  if (!content)
    return interaction.reply({
      content: `No tag called \`${name}\``,
      ephemeral: true,
    });
  return interaction.reply({ content: `${content}` });
}
