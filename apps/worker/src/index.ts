import { Hono } from "hono";
import { cors } from "hono/cors";
import round from "./routes/round";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://moviguessr.vercel.app"],
    allowMethods: ["GET", "OPTIONS"],
  })
);

app.route("/api/round", round);

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

export default app;
