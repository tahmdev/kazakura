import { ActivityType, Client } from "discord.js";
import { tagCache } from "../cache/tags";
import * as commands from "../commands/index";

export default (client: Client) => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    client.user?.setActivity({
      name: "言語に翼を。思考を空へ──",
      type: ActivityType.Playing,
    });
    await tagCache.buildCache();

    console.log(`${client.user.username} is online`);
  });
};
