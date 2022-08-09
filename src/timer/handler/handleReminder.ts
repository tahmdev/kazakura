import { Client } from "discord.js";
import { cache } from "../../cache/cache";
import { db } from "../../firebase";

export const handleReminder = (client: Client) => {
  //client.users.fetch("966692536758452315").then((user) => user.send("owo"));
  const now = Math.floor(new Date().getTime() / 1000);
  const filteredReminders = cache.reminders.filter((el) => el.time < now);
  for (let i = 0; i < filteredReminders.length; i++) {
    console.log(cache.reminders);
    const { message, author, createdAt, id } = filteredReminders[i];
    client.users
      .fetch(author)
      .then((user) =>
        user.send(
          `You asked me to set a reminder: \n ${message} \n This reminder has been created <t:${createdAt}:F>`
        )
      );
    db.doc(`users/${author}/reminders/${id}`).delete();
    cache.reminders.pop();
  }
};
