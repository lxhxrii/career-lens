import express from "express";
import {
  careers,
  careerNames,
  getCareer,
} from "../../src/data/careers.js";

const router = express.Router();

// ============================================================
// GET ALL CAREERS
// ============================================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    count: careerNames.length,
    careers: careerNames,
  });
});

// ============================================================
// GET CAREER BY NAME
// ============================================================

router.get("/:careerName", (req, res) => {
  const careerName = decodeURIComponent(
    req.params.careerName
  );

  const career = careers[careerName];

  if (!career) {
    return res.status(404).json({
      success: false,
      message: "Career not found",
    });
  }

  res.json({
    success: true,
    career: {
      name: careerName,
      ...career,
    },
  });
});

export default router;