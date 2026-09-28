import "dotenv/config";
import {
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  throw new Error("DISCORD_TOKEN and DISCORD_CLIENT_ID are required.");
}

const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Show Luna.win service status."),
  new SlashCommandBuilder()
    .setName("products")
    .setDescription("Show the Luna.win product catalog.")
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

const route = guildId
  ? Routes.applicationGuildCommands(clientId, guildId)
  : Routes.applicationCommands(clientId);

await rest.put(route, { body: commands });

console.log(
  guildId
    ? "Registered Luna commands for the configured guild."
    : "Registered Luna global commands."
);
