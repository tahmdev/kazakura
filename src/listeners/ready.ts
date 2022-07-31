import { Client } from "discord.js";
import * as owo from "../commands/index";

export default (client: Client) => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    console.log(owo);

    console.log(`${client.user.username} is online`);
  });
};
