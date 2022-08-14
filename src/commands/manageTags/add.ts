import {
  CommandInteraction,
  Client,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { cache } from "../../cache/cache";
import { db } from "../../firebase";

export async function execute(interaction: CommandInteraction, client: Client) {
  const modal = new ModalBuilder()
    .setCustomId("manage_tags.add")
    .setTitle("Add Tag");
  const nameInput = new TextInputBuilder()
    .setCustomId("name")
    .setLabel("Name")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(100);
  const bodyInput = new TextInputBuilder()
    .setCustomId("content")
    .setLabel("Content")
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(2000);
  const actionRow1 =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      nameInput
    );
  const actionRow2 =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      bodyInput
    );
  modal.addComponents(actionRow1, actionRow2);
  await interaction.showModal(modal);
}

export async function handleModal(
  interaction: ModalSubmitInteraction,
  client: Client
) {
  const name = interaction.fields.getTextInputValue("name").toLocaleLowerCase();
  const content = interaction.fields.getTextInputValue("content");
  const { guildId } = interaction;
  if (!guildId)
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });

  const { tags } = cache.guild(guildId);
  console.log(tags);
  if (tags[name]) {
    return interaction.reply({
      content: `Tag \`${name}\` already exists.`,
      ephemeral: true,
    });
  }

  try {
    await db
      .collection(`guilds/${guildId}/tags`)
      .doc()
      .create({ name, content });
    return interaction.reply({ content: `Added tag \`${name}\`.` });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
