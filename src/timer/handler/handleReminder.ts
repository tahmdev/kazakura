import { Client, EmbedBuilder } from "discord.js";
import { cache } from "../../cache/cache";
import { db } from "../../firebase";

export const handleReminder = (client: Client) => {
  //client.users.fetch("966692536758452315").then((user) => user.send("owo"));
  const now = Math.floor(new Date().getTime() / 1000);
  const filteredReminders = cache.reminders.filter((el) => el.time < now);
  for (let i = 0; i < filteredReminders.length; i++) {
    console.log(cache.reminders);
    const { message, author, createdAt, id } = filteredReminders[i];
    const embed = new EmbedBuilder()
      .setTitle("Reminder")
      .setColor("#1fde85")
      .setDescription(message || " ")
      .setTimestamp(new Date(createdAt * 1000))
      .setFooter({ text: "Created at" });
    try {
      client.users.fetch(author).then((user) => user.send({ embeds: [embed] }));
    } catch (error) {
      console.error(error);
    }
    try {
      db.doc(`users/${author}/reminders/${id}`).delete();
    } catch (error) {
      console.error(error);
      cache.reminders.pop();
    }
  }
};
