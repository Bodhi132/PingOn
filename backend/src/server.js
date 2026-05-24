/**
 * PingON optional Express API (JWT verification, health).
 * Run: `npm run dev` from the `backend/` folder (requires `backend/.env`).
 */
import "dotenv/config";
import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";

const app = createApp();
const { port } = getEnv();

app.listen(port, () => {
  console.log(`PingON API listening on http://localhost:${port}`);
});
