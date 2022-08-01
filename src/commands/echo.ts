import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalSubmitInteraction,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("echo")
  .setDescription("Echo back user input")
  .setDefaultMemberPermissions(0);

export async function execute(interaction: CommandInteraction, client: Client) {
  const modal = new ModalBuilder().setCustomId("echo").setTitle("Echo");
  const nameInput = new TextInputBuilder()
    .setCustomId("title")
    .setLabel("Title")
    .setStyle(TextInputStyle.Short);
  const bodyInput = new TextInputBuilder()
    .setCustomId("body")
    .setLabel("Body")
    .setStyle(TextInputStyle.Paragraph);
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
  const title = interaction.fields.getTextInputValue("title");
  const body = interaction.fields.getTextInputValue("body");
  interaction.reply({ content: body });
}
