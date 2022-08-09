import { Client } from "discord.js";
import { handleReminder } from "./handler/handleReminder";

export const startTimer = (client: Client) => {
  setInterval(() => {
    handleReminder(client);
  }, 1000);
};
