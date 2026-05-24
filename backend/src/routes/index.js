import { healthRouter } from "./health.routes.js";
import { v1Router } from "./v1.routes.js";

/**
 * @param {import('express').Express} app
 */
export function registerRoutes(app) {
  app.use("/health", healthRouter);
  app.use("/v1", v1Router);
}
