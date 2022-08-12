import {
  CommandInteraction,
  Client,
  AutocompleteInteraction,
} from "discord.js";
import { cache } from "../../cache/cache";
import * as commands from "../../commands/index";
import { db } from "../../firebase";

export async function autoComplete(
  interaction: AutocompleteInteraction,
  client: Client
) {
  const { guildId } = interaction;
  if (!guildId) return;
  let choices: any[] = [];
  const focusedValue = interaction.options.getFocused(true);
  const roles = interaction.guild?.roles.cache;
  const cmd = interaction.options.get("cmd")?.value?.toString();
  const { permissions } = cache.guild(guildId);
  if (focusedValue.name === "cmd") {
    choices = Object.keys(commands).map((el) => {
      return { name: el, value: el };
    });
  }

  if (focusedValue.name === "role" && roles) {
    if (!cmd) return [];
    choices = roles
      .filter((el) => {
        const { id } = el;
        return !permissions[cmd].includes(id);
      })
      .map((el) => {
        const { name, id } = el;
        return { name, value: id };
      });
  }

  const filtered = choices.filter((el) =>
    el.name.startsWith(focusedValue.value)
  );
  await interaction.respond(filtered);
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const { guildId } = interaction;
  const cmd = interaction.options.get("cmd")?.value?.toString().trim();
  const roleId = interaction.options.get("role")?.value?.toString().trim();
  if (!guildId || !cmd || !roleId) return;

  const permissions = cache.guild(guildId).permissions[cmd] || [];

  try {
    await db
      .collection(`guilds/${guildId}/permissions`)
      .doc(cmd)
      .set({ roleIds: [roleId, ...permissions] });
    return interaction.reply({
      content: `Added permissions to use ${cmd} to <@&${roleId}>`,
    });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "Something went wrong.",
      ephemeral: true,
    });
  }
}
