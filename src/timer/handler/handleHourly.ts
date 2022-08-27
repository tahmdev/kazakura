import { Client } from "discord.js";

export const handleHourly = (client: Client) => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  if (seconds === 0 && minutes === 0) {
    client.users.fetch("966692536758452315").then((user) =>
      user.send({
        content: "This is your hourly reminder to get up and move around",
      })
    );
  }
};
