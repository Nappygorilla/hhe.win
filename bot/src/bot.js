import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits
} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const apiUrl = process.env.LUNA_API_URL;

if (!token) {
  throw new Error("DISCORD_TOKEN is required.");
}

if (!apiUrl) {
  throw new Error("LUNA_API_URL is required.");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function getApi(pathname) {
  const response = await fetch(new URL(pathname, apiUrl));
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json();
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Luna bot online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "status") {
      const status = await getApi("/api/status");

      await interaction.reply({
        ephemeral: true,
        content: [
          "Luna.win status",
          `Website: ${status.website}`,
          `API: ${status.api}`,
          `Database: ${status.database}`,
          `Catalog: ${status.catalog}`
        ].join("\n")
      });
      return;
    }

    if (interaction.commandName === "products") {
      const data = await getApi("/api/products");
      const lines = data.products.map(
        (product) => `• ${product.name} — ${product.status}`
      );

      await interaction.reply({
        ephemeral: true,
        content: ["Luna.win catalog", ...lines].join("\n")
      });
      return;
    }

    await interaction.reply({
      ephemeral: true,
      content: "Unknown command."
    });
  } catch (error) {
    console.error(error);

    const reply = {
      ephemeral: true,
      content: "Luna.win API is currently unavailable."
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
});

client.login(token);
