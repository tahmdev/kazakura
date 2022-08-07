import { ActivityType, Client } from "discord.js";
import { tagCache } from "../cache/tags";
import * as commandModules from "../commands/index";
const commands = Object(commandModules);
export default (client: Client) => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    client.user?.setActivity({
      name: "言語に翼を。思考を空へ──",
      type: ActivityType.Playing,
    });
    tagCache.buildCache();

    console.log(
      `${client.user.username} initialized with ${
        Object.keys(commands).length
      } commands.`
    );
  });
};
