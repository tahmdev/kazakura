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
  if (!guildId || !name) return interaction.reply("Something went wrong!");
  const { content, id } = cache.guild(guildId).tags[name] || {};
  if (!content || !id)
    return interaction.reply({
      content: `Tag \`${name}\` does not exist.`,
      ephemeral: true,
    });

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
    .setValue(name);
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
  const name = interaction.fields.getTextInputValue("name").toLocaleLowerCase();
  const content = interaction.fields.getTextInputValue("content");

  if (!guildId) {
    return interaction.reply({
      content: `Something went wrong.`,
      ephemeral: true,
    });
  }

  if (
    !Object.entries(cache.guild(guildId).tags).some((el) => el[1].id === id)
  ) {
    return interaction.reply({
      content:
        "Could not find tag with matching ID. Make sure you do not edit the ID field.",
      ephemeral: true,
    });
  }

  try {
    await db.doc(`guilds/${guildId}/tags/${id}`).update({
      name,
      content,
    });
    return interaction.reply({ content: `Edited tag \`${name}\`.` });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
