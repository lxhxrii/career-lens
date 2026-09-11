import express from "express";

import db from "../database/db.js";

import { getCareer } from "../../src/data/careers.js";

import {
  hasMatchingSkill,
  getCanonicalSkill,
} from "../../src/data/skills.js";


const router = express.Router();


// ============================================================
// GET CAREER ANALYTICS FOR A PROFILE
//
// GET /api/analytics/profile/:id
// ============================================================

router.get("/profile/:id", (req, res) => {

  try {

    const profileId = Number(req.params.id);


    // ========================================================
    // VALIDATE PROFILE ID
    // ========================================================

    if (!Number.isInteger(profileId) || profileId <= 0) {

      return res.status(400).json({
        success: false,
        message: "Invalid profile ID",
      });

    }


    // ========================================================
    // GET PROFILE FROM SQLITE
    // ========================================================

    const profile = db
      .prepare(
        "SELECT * FROM profiles WHERE id = ?"
      )
      .get(profileId);


    if (!profile) {

      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });

    }


    // ========================================================
    // GET TARGET CAREER
    // ========================================================

    const career = getCareer(
      profile.targetCareer
    );


    // ========================================================
    // GET USER SKILLS
    // ========================================================

    let userSkills = [];

    try {

      userSkills =
        JSON.parse(profile.skills || "[]");

    } catch (error) {

      userSkills = [];

    }


    if (!Array.isArray(userSkills)) {
      userSkills = [];
    }


    // ========================================================
    // CAREER REQUIRED SKILLS
    // ========================================================

    const requiredSkills =
      career.skills || [];


    // ========================================================
    // MATCH USER SKILLS
    // ========================================================

    const matchedSkills = [];

    const missingSkills = [];


    requiredSkills.forEach(
      (requiredSkill) => {

        const requiredSkillName =
          typeof requiredSkill === "string"
            ? requiredSkill
            : requiredSkill.name;


        const matched =
          userSkills.some(
            (userSkill) =>
              hasMatchingSkill(
                userSkill,
                requiredSkillName
              )
          );


        if (matched) {

          matchedSkills.push(
            requiredSkillName
          );

        } else {

          missingSkills.push(
            requiredSkillName
          );

        }

      }
    );


    // ========================================================
    // CALCULATE READINESS SCORE
    // ========================================================

    let totalDemand = 0;

    let matchedDemand = 0;


    requiredSkills.forEach(
      (requiredSkill) => {

        const skillName =
          typeof requiredSkill === "string"
            ? requiredSkill
            : requiredSkill.name;


        const demand =
          typeof requiredSkill === "object" &&
          requiredSkill.demand
            ? requiredSkill.demand
            : 100;


        totalDemand += demand;


        if (
          matchedSkills.includes(
            skillName
          )
        ) {

          matchedDemand += demand;

        }

      }
    );


    const readinessScore =
      totalDemand === 0
        ? 0
        : Math.round(
            (matchedDemand /
              totalDemand) *
              100
          );


    // ========================================================
    // SKILL BREAKDOWN
    // ========================================================

    const skillBreakdown =
      requiredSkills.map(
        (requiredSkill) => {

          const skillName =
            typeof requiredSkill === "string"
              ? requiredSkill
              : requiredSkill.name;


          const demand =
            typeof requiredSkill === "object" &&
            requiredSkill.demand
              ? requiredSkill.demand
              : 100;


          const matched =
            matchedSkills.includes(
              skillName
            );


          return {

            skill: skillName,

            demand,

            status:
              matched
                ? "Matched"
                : "Missing",

            canonicalSkill:
              getCanonicalSkill(
                skillName
              ),

          };

        }
      );


    // ========================================================
    // READINESS LEVEL
    // ========================================================

    let readinessLevel;


    if (readinessScore >= 80) {

      readinessLevel = "Excellent";

    } else if (readinessScore >= 65) {

      readinessLevel = "Good";

    } else if (readinessScore >= 50) {

      readinessLevel = "Moderate";

    } else {

      readinessLevel = "Needs Improvement";

    }


    // ========================================================
    // RECOMMENDED NEXT SKILLS
    // ========================================================

    const recommendedSkills =
      requiredSkills
        .filter(
          (skill) => {

            const skillName =
              typeof skill === "string"
                ? skill
                : skill.name;

            return !matchedSkills.includes(
              skillName
            );

          }
        )
        .sort(
          (a, b) => {

            const demandA =
              typeof a === "object" &&
              a.demand
                ? a.demand
                : 0;

            const demandB =
              typeof b === "object" &&
              b.demand
                ? b.demand
                : 0;

            return demandB - demandA;

          }
        )
        .slice(0, 3)
        .map(
          (skill) =>
            typeof skill === "string"
              ? skill
              : skill.name
        );


    // ========================================================
    // FINAL RESPONSE
    // ========================================================

    res.json({

      success: true,

      analytics: {

        profileId,

        candidateName:
          profile.name,

        targetCareer:
          profile.targetCareer,

        readinessScore,

        readinessLevel,

        matchedSkills,

        missingSkills,

        totalRequiredSkills:
          requiredSkills.length,

        totalMatchedSkills:
          matchedSkills.length,

        totalMissingSkills:
          missingSkills.length,

        skillBreakdown,

        recommendedSkills,

        career: {

          demand:
            career.demand,

          growth:
            career.growth,

          salary:
            career.salary,

          jobs:
            career.jobs,

          topLocation:
            career.topLocation,

        },

      },

    });

  } catch (error) {

    console.error(
      "Analytics error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to calculate career analytics",

    });

  }

});


export default router;