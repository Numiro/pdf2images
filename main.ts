import app from "./src/app.ts";
import { env } from "./src/env.ts";

if (import.meta.main) {
  Deno.serve({ port: Number.parseInt(env.PORT) }, app.fetch);
}
