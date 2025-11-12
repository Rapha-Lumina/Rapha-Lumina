import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, "../client/dist");

async function boot() {
  // 1. Clean up messages older than 7 days
  try {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await prisma.message.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    console.log(`[cleanup] Deleted ${result.count} messages older than 7 days`);
  } catch (err) {
    console.error("[cleanup] Failed to delete old messages:", err);
  }

  // 2. Start Express server
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "4mb" }));
  app.use(cookieParser());

  // API routes
  app.use("/api", routes);

  // Serve built client
  app.use(express.static(clientDist));

  // SPA fallback (for React Router)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  const PORT = Number(process.env.PORT || 5000);
  app.listen(PORT, () => console.log(`[express] Server started on ${PORT}`));
}

// Boot up the server
boot().catch((e) => {
  console.error("Fatal error starting server:", e);
  process.exit(1);
});
