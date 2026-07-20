import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Plated v1 is a fully client-side prototype: meal generation runs on
// mock data in src/lib/mealEngine.ts, so this server only serves the
// app. The v2 AI endpoints (photo ingredient detection, LLM meal
// generation) previously lived here and remain available in git history.

const app = express();
const PORT = 3000;

app.use(express.json());

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Plated] Listening on http://localhost:${PORT} (${process.env.NODE_ENV || "development"})`);
  });
}

startServer();
