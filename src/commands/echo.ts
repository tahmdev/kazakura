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
  const bodyInput = new TextInputBuilder()
    .setCustomId("body")
    .setLabel("Body")
    .setStyle(TextInputStyle.Paragraph);

  const actionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      bodyInput
    );
  modal.addComponents(actionRow);
  await interaction.showModal(modal);
}

export async function handleModal(
  interaction: ModalSubmitInteraction,
  client: Client
) {
  const content = interaction.fields.getTextInputValue("body");
  interaction.reply({ content });
}
