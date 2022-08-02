import {
  CommandInteraction,
  Client,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalSubmitInteraction,
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
  if (!interaction.guildId || !tag)
    return interaction.reply("Something went wrong!");
  const { content, id } = tagCache.cache[interaction.guildId][tag];

  const modal = new ModalBuilder()
    .setCustomId("manage_tags.edit")
    .setTitle("Edit Tag");
  const idInput = new TextInputBuilder()
    .setCustomId("id")
    .setLabel("ID")
    .setStyle(TextInputStyle.Short)
    .setValue(id);
  const nameInput = new TextInputBuilder()
    .setCustomId("name")
    .setLabel("Name")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(100)
    .setValue(tag);
  const bodyInput = new TextInputBuilder()
    .setCustomId("content")
    .setLabel("Content")
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(2000)
    .setValue(content);
  const actionRow1 =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      idInput
    );
  const actionRow2 =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      nameInput
    );
  const actionRow3 =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      bodyInput
    );
  modal.addComponents(actionRow1, actionRow2, actionRow3);
  await interaction.showModal(modal);
}

export async function handleModal(
  interaction: ModalSubmitInteraction,
  client: Client
) {
  const { guildId } = interaction;
  const id = interaction.fields.getTextInputValue("id");
  const name = interaction.fields.getTextInputValue("name");
  const text = interaction.fields.getTextInputValue("content");

  if (!guildId) {
    return interaction.reply({
      content: `Something went wrong.`,
      ephemeral: true,
    });
  }

  if (!Object.entries(tagCache.cache[guildId]).some((el) => el[1].id === id)) {
    return interaction.reply({
      content:
        "Could not find tag with matching ID. Make sure you do not edit the ID field.",
      ephemeral: true,
    });
  }

  try {
    await db.collection(`guilds/${guildId}/tags`).doc(id).update({
      name,
      text,
    });
    tagCache.buildCache();
    return interaction.reply({ content: `Edited tag \`${name}\`.` });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
