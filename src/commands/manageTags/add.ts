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
import { addDoc, collection } from "firebase/firestore";
import { tagCache } from "../../cache/tags";
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
  const tagData = {
    name: interaction.fields.getTextInputValue("name"),
    text: interaction.fields.getTextInputValue("content"),
  };
  const { guildId } = interaction;
  if (!guildId)
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });

  if (tagCache.cache[guildId]?.[tagData.name]) {
    return interaction.reply({
      content: `Tag \`${tagData.name}\` already exists.`,
      ephemeral: true,
    });
  }

  try {
    await addDoc(collection(db, "guilds", `${guildId}`, "tags"), tagData);
    await tagCache.buildCache();
    return interaction.reply({ content: `Added tag \`${tagData.name}\`.` });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
