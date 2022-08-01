import { Client } from "discord.js";
import { tagCache } from "../cache/tags";
import * as commands from "../commands/index";

export default (client: Client) => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    await tagCache.buildCache();


    console.log(`${client.user.username} is online`);
  });
};
