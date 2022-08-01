import {
  CommandInteraction,
  Client,
  AutocompleteInteraction,
} from "discord.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { tagCache } from "../../cache/tags";
import { db } from "../../firebase";

export async function autoComplete(
  interaction: AutocompleteInteraction,
  client: Client
) {
  if (!interaction.guildId) return;
  const focusedValue = interaction.options.getFocused();
  const choices = Object.keys(tagCache.cache[interaction.guildId]);
  const filtered = choices.filter((el) => el.startsWith(focusedValue));
  await interaction.respond(filtered.map((el) => ({ name: el, value: el })));
}

export async function execute(interaction: CommandInteraction, client: Client) {
  const tag = interaction.options.get("tag")?.value?.toString().trim();

  if (!interaction.guildId || !tag)
    return interaction.reply(`Something went wrong.`);
  if (!tagCache.cache[interaction.guildId][tag])
    return interaction.reply(`Tag \`${tag}\` does not exist.`);

  try {
    await deleteTag(tag, interaction.guildId);
    await tagCache.buildCache();
    return interaction.reply(`Deleted \`${tag}\``);
  } catch (error) {
    console.log(error);
    return interaction.reply(`Something went wrong.`);
  }
}

async function deleteTag(tag: any, guild: string) {
  const ref = collection(db, "guilds", `${guild}`, "tags");
  const q = query(ref, where("name", "==", tag));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "guilds", `${guild}`, "tags", document.ref.id));
  });
}
