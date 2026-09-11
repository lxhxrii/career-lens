import express from "express";

import {
  skills,
  skillNames,
  getSkill,
  getSkillsByCategory,
} from "../../src/data/skills.js";

const router = express.Router();

// ============================================================
// GET ALL SKILLS
// ============================================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    count: skillNames.length,
    skills: skillNames,
  });
});

// ============================================================
// GET SKILLS BY CATEGORY
// ============================================================

router.get("/category/:category", (req, res) => {
  const category = decodeURIComponent(
    req.params.category
  );

  const groupedSkills = getSkillsByCategory();

  const matchingCategory = Object.keys(
    groupedSkills
  ).find(
    (item) =>
      item.toLowerCase() === category.toLowerCase()
  );

  if (!matchingCategory) {
    return res.status(404).json({
      success: false,
      message: "Skill category not found",
    });
  }

  res.json({
    success: true,
    category: matchingCategory,
    skills: groupedSkills[matchingCategory],
  });
});

// ============================================================
// GET ONE SKILL
// ============================================================

router.get("/:skillName", (req, res) => {
  const skillName = decodeURIComponent(
    req.params.skillName
  );

  const skill = getSkill(skillName);

  if (!skill) {
    return res.status(404).json({
      success: false,
      message: "Skill not found",
    });
  }

  res.json({
    success: true,
    skill: {
      name: skillName,
      ...skill,
    },
  });
});

export default router;