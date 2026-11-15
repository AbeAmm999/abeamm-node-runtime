import express from "express";
import helmet from "helmet";
import os from "node:os";
import crypto from "node:crypto";

const app = express();
app.use(helmet());
app.use(express.json({ limit: "32kb" }));

const PORT = Number(process.env.PORT || 10000);
const API_TOKEN = process.env.ABEAMM_RUNTIME_TOKEN;

if (!API_TOKEN) {
  console.error("Missing ABEAMM_RUNTIME_TOKEN. Set it in the service environment.");
  process.exit(1);
}

const startedAt = Date.now();
const timingSafeEqual = (a, b) => {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "abeamm-node-runtime", timestamp: new Date().toISOString() });
});

app.use("/api", (req, res, next) => {
  const supplied = req.header("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!timingSafeEqual(supplied, API_TOKEN)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.get("/api/status", (_req, res) => {
  const total = os.totalmem();
  const free = os.freemem();
  res.json({
    ok: true,
    runtime: "node",
    hostname: os.hostname(),
    platform: process.platform,
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    serviceUptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    memory: { totalBytes: total, freeBytes: free, usedBytes: total - free },
    loadAverage: os.loadavg(),
    cpuCount: os.cpus().length,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/echo", (req, res) => {
  res.json({ ok: true, received: req.body ?? null });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AbeAmm Node Runtime listening on ${PORT}`);
});
