import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import careerRoutes from "./routes/careers.js";
import jobRoutes from "./routes/jobs.js";
import skillRoutes from "./routes/skills.js";
import profileRoutes from "./routes/profile.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// HOME ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CareerLens API is running 🚀",
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "CareerLens Backend",
  });
});

// ============================================================
// CAREER API
// ============================================================

app.use("/api/careers", careerRoutes);

// ============================================================
// JOBS API
// ============================================================

app.use("/api/jobs", jobRoutes);

// ============================================================
// SKILLS API
// ============================================================

app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);


// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(
    `CareerLens backend running on http://localhost:${PORT}`
  );
});