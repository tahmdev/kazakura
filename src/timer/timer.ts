import { Client } from "discord.js";
import { handleHourly } from "./handler/handleHourly";
import { handleReminder } from "./handler/handleReminder";

export const startTimer = (client: Client) => {
  setInterval(() => {
    handleReminder(client);
    handleHourly(client);
  }, 1000);
};
