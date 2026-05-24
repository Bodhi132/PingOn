import cors from "cors";
import { getEnv } from "../config/env.js";

export function corsMiddleware() {
  const { frontendOrigin } = getEnv();
  return cors({
    origin: frontendOrigin,
    credentials: true,
  });
}
