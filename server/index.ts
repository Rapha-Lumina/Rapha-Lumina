import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import { createServer } from "http";
import { odooService } from "./odoo";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup authentication (sessions + passport)
await setupAuth(app);

// Register all API routes
registerRoutes(app);

// Create HTTP server for both Express and Vite HMR
const server = createServer(app);

// Setup Vite or static serving based on environment
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

// Initialize Odoo connection
if (odooService) {
  await odooService.authenticate().catch(err => {
    console.warn('[Odoo] Failed to authenticate on startup:', err.message);
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error: ${message}`, "express");
  res.status(status).json({ message });
});

// Start server
const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  log(`Server successfully started on port ${PORT}`, "express");
  log(`Environment: ${app.get("env")}`, "express");
  log(`ANTHROPIC_API_KEY configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`, "express");
});
