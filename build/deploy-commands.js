"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const commandModules = __importStar(require("./commands/index"));
const { TOKEN, CLIENT_ID } = process.env;
const commands = [];
for (const module of Object.values(commandModules)) {
    commands.push(module.data);
}
if (TOKEN !== undefined && CLIENT_ID !== undefined) {
    const rest = new rest_1.REST({ version: "10" }).setToken(TOKEN);
    rest
        .put(discord_js_1.Routes.applicationCommands(CLIENT_ID), {
        body: commands,
    })
        .then(() => console.log(`Successfully registered ${commands.length} application commands.`))
        .catch(console.error);
}
