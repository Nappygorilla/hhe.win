import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { checkDatabase } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 8080);
const corsOrigin = process.env.CORS_ORIGIN || "https://luna.win";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: corsOrigin,
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  const database = await checkDatabase();

  res.status(database.connected || !database.configured ? 200 : 503).json({
    ok: database.connected || !database.configured,
    service: "luna-api",
    environment: process.env.NODE_ENV || "development",
    database
  });
});

app.get("/api/status", async (_req, res) => {
  const database = await checkDatabase();

  res.json({
    website: "operational",
    api: "operational",
    database: database.configured
      ? (database.connected ? "operational" : "degraded")
      : "not_configured",
    catalog: "1 live / 7 coming soon"
  });
});

app.get("/api/products", (_req, res) => {
  res.json({
    products: [
      { slug: "roblox-external", name: "Roblox External", category: "roblox", status: "available", priceCents: 0, lifetimeKeyCents: 500 },
      { slug: "fortnite", name: "Fortnite", category: "fortnite", status: "coming_soon" },
      { slug: "cs2", name: "CS2", category: "cs2", status: "coming_soon" },
      { slug: "call-of-duty", name: "Call of Duty", category: "cod", status: "coming_soon" },
      { slug: "temp-spoofer", name: "Temp Spoofer", category: "spoofer", status: "coming_soon" },
      { slug: "perm-spoofer", name: "Perm Spoofer", category: "spoofer", status: "coming_soon" },
      { slug: "fivem", name: "FiveM", category: "fivem", status: "coming_soon" },
      { slug: "gorilla-tag", name: "Gorilla Tag", category: "gorilla-tag", status: "coming_soon" }
    ]
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_server_error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Luna API listening on port ${port}`);
});
