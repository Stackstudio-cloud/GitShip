import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function applySecurity(app: Express) {
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: false, // handled by frontend build; disable in dev
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: (origin, cb) => cb(null, true), // allow all for now; tighten if needed
    credentials: true,
  }));

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300, // 300 req/min per IP by default
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);
}


