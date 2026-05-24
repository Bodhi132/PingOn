import express from "express";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { registerRoutes } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(corsMiddleware());
  app.use(express.json());

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
